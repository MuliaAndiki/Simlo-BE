import express from "express";
import AuthController from "@/controllers/AuthController";
class AuthRouter {
  public authRouter;
  constructor() {
    this.authRouter = express.Router();
    this.routes();
  }

  private routes() {
    this.authRouter.post("/google", AuthController.loginGoogle);
    this.authRouter.patch("/picture", AuthController.patchPictureUser);
    this.authRouter.post("/developer", AuthController.loginDeveloper);
    this.authRouter.post("/logout", AuthController.logout);
  }
}

export default new AuthRouter().authRouter;
