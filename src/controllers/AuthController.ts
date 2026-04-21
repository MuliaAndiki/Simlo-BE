import { Request, Response } from "express";
import { JwtPayload } from "../types/auth.types";
import AuthService from "@/service/AuthService";
import { verifyToken } from "@/middleware/auth";
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

class AuthController {
  public loginGoogle = async (req: Request, res: Response): Promise<void> => {
    try {
      const service = await AuthService.loginWithGoogleService(res, req);

      if (!service) {
        res.status(400).json({
          status: 400,
          message: "bad request",
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: "successfully login with google",
        data: service,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error,
      });
      return;
    }
  };
  public patchPictureUser = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const users: JwtPayload = req.user!;
        if (!users) {
          res.status(401).json({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        const service = await AuthService.patchPictureUser(req, res, users);

        if (!service) {
          res.status(400).json({
            status: 400,
            message: "bad request",
          });
          return;
        }

        res.status(200).json({
          status: 203,
          message: "successfully update Picture",
          data: service,
        });
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "server internal error",
          error: error,
        });
        return;
      }
    },
  ];
}

export default new AuthController();
