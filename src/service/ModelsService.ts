import { IMLResponse } from "@/types/ml.types";
import "@tensorflow/tfjs-node";
import * as tf from "@tensorflow/tfjs-node";
import { Response } from "express";
import { getModel, isModelReady } from "@/utils/loader";

class MlClassServive {
  private async processImageToTensor(imageUrl: string) {
    const download = await fetch(imageUrl);
    if (!download.ok) {
      throw new Error("Image download failed");
    }

    const arrayBuffer = await download.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    return (tf as any).tidy(() => {
      return (tf as any).node
        .decodeImage(imageBuffer, 3)
        .resizeBilinear([224, 224])
        .expandDims(0)
        .toFloat()
        .div(255.0);
    });
  }
  public async GetPrediction(imageUrl: string, res: Response) {
    try {
      if (!isModelReady) {
        res.status(503).json({
          status: 503,
          message: "models not loader",
        });
        return;
      }

      const model = getModel();
      const tensor = await this.processImageToTensor(imageUrl);

      const prediction = model.predict(tensor);
      const rawScores = await prediction.data();

      tensor.dispose();
      prediction.dispose();

      const topScore = Math.max(...(Array.from(rawScores) as any));
      const isDetected = topScore > 0.5;

      const result: IMLResponse = {
        is_Detected: isDetected,
        confidenceScore: parseFloat(topScore.toFixed(2)),
        model_version: "v1.0.0",
        processed_at: new Date(),
        boundingBoxes: [],
      };

      return result;
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "model internal error",
        error: error,
      });
      return;
    }
  }
}

export default new MlClassServive();
