import UserSessionController from "@/controllers/UserSessionController";
import express from "express";
class UserSessionRoutes {
  public userSessionRouter;
  constructor() {
    this.userSessionRouter = express.Router();
    this.routes();
  }

  private routes() {
    this.userSessionRouter.get("/current", UserSessionController.curentUser);
  }
}

export default new UserSessionRoutes().userSessionRouter;
