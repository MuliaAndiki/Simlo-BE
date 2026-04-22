import { verifyToken } from "@/middleware/auth";
import { JwtPayload } from "@/types/auth.types";
import { Request, Response } from "express";
import UserSessionService from "@/service/UserSessionService";

class UserSessionController {
  public curentUser = [
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

        const service = await UserSessionService.getCurrentUser(res, users);

        if (!service) {
          res.status(400).json({
            status: 400,
            message: "bad request",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          message: "successfully get curent users",
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

export default new UserSessionController();
