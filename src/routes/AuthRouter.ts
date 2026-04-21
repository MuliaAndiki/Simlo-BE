import express from "express";
import AuthController from "@/controllers/AuthController";
class AuthRouter {
  public authRouter;
  constructor() {
    this.authRouter = express.Router();
    this.routes();
  }

  private routes() {
    /**
     * @swagger
     * /login:
     *   post:
     *     summary: Retrieve a list of users
     *     responses:
     *       200:
     *         description: A list of users.
     */
    this.authRouter.post("/google", AuthController.loginGoogle);
    this.authRouter.patch("/picture", AuthController.patchPictureUser);
  }
}

export default new AuthRouter().authRouter;
