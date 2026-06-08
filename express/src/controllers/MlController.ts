import { Request, Response } from "express";
import ModelsService, { MlServiceError } from "@/service/ModelsService";

class MlController {
  public predict = async (req: Request, res: Response): Promise<void> => {
    try {
      const { image_url } = req.body;

      if (!image_url) {
        res.status(400).json({
          status: 400,
          message: "image_url wajib diisi",
        });
        return;
      }

      const service = await ModelsService.GetPrediction(image_url);
      const { annotated_image_base64: _base64, ...safeData } = service;

      res.status(200).json({
        status: 200,
        message: "prediksi berhasil",
        data: safeData,
      });
    } catch (error) {
      if (error instanceof MlServiceError) {
        res.status(error.statusCode).json({
          status: error.statusCode,
          message: error.message,
          error: error.details,
        });
        return;
      }

      res.status(500).json({
        status: 500,
        message: "server internal error",
        error: error,
      });
    }
  };

  public health = async (_req: Request, res: Response): Promise<void> => {
    try {
      const service = await ModelsService.proxyHealthCheck();

      res.status(200).json({
        status: 200,
        message: "ml service health",
        data: service,
      });
    } catch (error) {
      const statusCode =
        error instanceof MlServiceError ? error.statusCode : 503;

      res.status(statusCode).json({
        status: statusCode,
        message: "ml service unavailable",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new MlController();
