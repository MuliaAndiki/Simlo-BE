import express from "express";

class AuthRouter {
  public authRouter;
  constructor() {
    this.authRouter = express.Router();
    this.routes();
  }

  private routes() {
    //  Initial Route
  }
}

export default new AuthRouter().authRouter;
