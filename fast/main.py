import base64
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated

import cv2
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, HttpUrl
from ultralytics import YOLO

load_dotenv()

MODEL_PATH = Path(__file__).resolve().parent / "best.pt"
MODEL_VERSION = os.getenv("ML_MODEL_VERSION", "best.pt-v1.0.0")
CONFIDENCE_THRESHOLD = float(os.getenv("ML_CONFIDENCE_THRESHOLD", "0.5"))
INTERNAL_API_SECRET = os.getenv("INTERNAL_API_SECRET", "")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000").rstrip("/")

model: YOLO | None = None


def get_cors_origins() -> list[str]:
    origins: list[str] = []

    if BACKEND_URL:
        origins.append(BACKEND_URL)

    extra_origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
    for origin in extra_origins.split(","):
        cleaned = origin.strip().rstrip("/")
        if cleaned and cleaned not in origins:
            origins.append(cleaned)

    return origins


class PredictRequest(BaseModel):
    image_url: HttpUrl


class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float
    label: str


class PredictResponse(BaseModel):
    is_Detected: bool
    confidenceScore: float
    model_version: str
    processed_at: datetime
    boundingBoxes: list[BoundingBox] = Field(default_factory=list)
    annotated_image_base64: str | None = None


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_path: str
    model_version: str
    backend_url: str


def verify_internal_api_key(
    x_internal_api_key: Annotated[str | None, Header()] = None,
) -> None:
    if not INTERNAL_API_SECRET:
        raise HTTPException(
            status_code=500,
            detail="INTERNAL_API_SECRET is not configured",
        )

    if not x_internal_api_key or x_internal_api_key != INTERNAL_API_SECRET:
        raise HTTPException(
            status_code=403,
            detail="Invalid internal API key",
        )


@asynccontextmanager
async def lifespan(_: FastAPI):
    global model

    if not MODEL_PATH.exists():
        raise RuntimeError(f"Model file not found: {MODEL_PATH}")

    model = YOLO(str(MODEL_PATH))
    print(f"ML service terhubung ke backend: {BACKEND_URL}")
    yield
    model = None


app = FastAPI(
    title="Simlo ML Service",
    description="Deteksi jalan berlobang menggunakan model YOLO best.pt",
    version=MODEL_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok" if model is not None else "unavailable",
        model_loaded=model is not None,
        model_path=str(MODEL_PATH),
        model_version=MODEL_VERSION,
        backend_url=BACKEND_URL,
    )


@app.post(
    "/predict",
    response_model=PredictResponse,
    dependencies=[Depends(verify_internal_api_key)],
)
def predict(payload: PredictRequest) -> PredictResponse:
    if model is None:
        raise HTTPException(status_code=503, detail="Model belum dimuat")

    try:
        results = model.predict(
            source=str(payload.image_url),
            conf=CONFIDENCE_THRESHOLD,
            verbose=False,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal memproses gambar: {exc}",
        ) from exc

    bounding_boxes: list[BoundingBox] = []
    top_confidence = 0.0
    annotated_image_base64: str | None = None

    for result in results:
        if result.boxes is None:
            continue

        names = result.names or {}

        for box in result.boxes:
            confidence = float(box.conf[0])
            class_id = int(box.cls[0])
            label = str(names.get(class_id, "berlubang"))
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            bounding_boxes.append(
                BoundingBox(
                    x=float(x1),
                    y=float(y1),
                    width=float(x2 - x1),
                    height=float(y2 - y1),
                    label=label,
                )
            )
            top_confidence = max(top_confidence, confidence)

        if len(bounding_boxes) > 0 and annotated_image_base64 is None:
            plotted = result.plot()
            success, buffer = cv2.imencode(".png", plotted)
            if success:
                annotated_image_base64 = base64.b64encode(buffer).decode("utf-8")

    return PredictResponse(
        is_Detected=len(bounding_boxes) > 0,
        confidenceScore=round(top_confidence, 2),
        model_version=MODEL_VERSION,
        processed_at=datetime.now(timezone.utc),
        boundingBoxes=bounding_boxes,
        annotated_image_base64=annotated_image_base64,
    )
