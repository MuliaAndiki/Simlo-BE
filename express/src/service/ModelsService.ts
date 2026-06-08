import { IMLResponse } from "@/types/ml.types";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL ?? "http://localhost:8000";
const ML_SERVICE_TIMEOUT_MS = Number(
  process.env.ML_SERVICE_TIMEOUT_MS ?? 30000,
);

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

      throw new MlServiceError(
        503,
        "ml service unavailable",
        error instanceof Error ? error.message : error,
      );
    }
  }

  public async proxyHealthCheck() {
    const mlResponse = await fetch(`${ML_SERVICE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(ML_SERVICE_TIMEOUT_MS),
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
