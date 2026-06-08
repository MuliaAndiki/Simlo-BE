import express from "express";
import MlController from "@/controllers/MlController";

class MlRouter {
  public mlRouter;

  constructor() {
    this.mlRouter = express.Router();
    this.routes();
  }

  private routes() {
    this.mlRouter.get("/health", MlController.health);
    this.mlRouter.post("/predict", MlController.predict);
  }
}

export default new MlRouter().mlRouter;
