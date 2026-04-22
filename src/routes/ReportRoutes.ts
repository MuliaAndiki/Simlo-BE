import express from "express";
import ReportController from "@/controllers/ReportController";
class ReportRouter {
  public reportRouter;
  constructor() {
    this.reportRouter = express.Router();
    this.routes();
  }
  private routes() {
    this.reportRouter.post("/created", ReportController.create);
    this.reportRouter.delete("/delete/:id", ReportController.delete);
  }
}

export default new ReportRouter().reportRouter;
