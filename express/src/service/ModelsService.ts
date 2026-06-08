import { IMLResponse } from "@/types/ml.types";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL ?? "http://localhost:8000";
/** Default 3 menit — YOLO + download gambar + anotasi bisa lambat saat cold start */
const ML_SERVICE_TIMEOUT_MS = Number(
  process.env.ML_SERVICE_TIMEOUT_MS ?? 180000,
);
const ML_HEALTH_TIMEOUT_MS = Number(process.env.ML_HEALTH_TIMEOUT_MS ?? 15000);

export class MlServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "MlServiceError";
  }
}

class MlClassServive {
  private buildMlHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (process.env.INTERNAL_API_SECRET) {
      headers["x-internal-api-key"] = process.env.INTERNAL_API_SECRET;
    }

    return headers;
  }

  public async GetPrediction(imageUrl: string): Promise<IMLResponse> {
    try {
      const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: "POST",
        headers: this.buildMlHeaders(),
        body: JSON.stringify({ image_url: imageUrl }),
        signal: AbortSignal.timeout(ML_SERVICE_TIMEOUT_MS),
      });

      if (mlResponse.status === 503) {
        throw new MlServiceError(503, "Model belum dimuat");
      }

      if (!mlResponse.ok) {
        const errorBody = await mlResponse.json().catch(() => ({}));
        throw new MlServiceError(
          mlResponse.status,
          "ml service error",
          errorBody,
        );
      }

      const data = (await mlResponse.json()) as Omit<
        IMLResponse,
        "processed_at"
      > & {
        processed_at: string;
        annotated_image_base64?: string | null;
      };

      return {
        is_Detected: data.is_Detected,
        confidenceScore: data.confidenceScore,
        model_version: data.model_version,
        processed_at: new Date(data.processed_at),
        boundingBoxes: data.boundingBoxes ?? [],
        annotated_image_base64: data.annotated_image_base64 ?? null,
      };
    } catch (error) {
      if (error instanceof MlServiceError) {
        throw error;
      }

      const isTimeout =
        error instanceof Error &&
        (error.name === "TimeoutError" ||
          error.name === "AbortError" ||
          error.message.toLowerCase().includes("timeout") ||
          error.message.toLowerCase().includes("aborted"));

      throw new MlServiceError(
        503,
        isTimeout
          ? `ML service timeout setelah ${ML_SERVICE_TIMEOUT_MS / 1000} detik. Coba lagi atau naikkan ML_SERVICE_TIMEOUT_MS.`
          : "ml service unavailable",
        error instanceof Error ? error.message : error,
      );
    }
  }

  public async proxyHealthCheck() {
    const mlResponse = await fetch(`${ML_SERVICE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(ML_HEALTH_TIMEOUT_MS),
    });

    if (!mlResponse.ok) {
      throw new MlServiceError(
        mlResponse.status,
        `ML health check failed with status ${mlResponse.status}`,
      );
    }

    return mlResponse.json();
  }
}

export default new MlClassServive();
