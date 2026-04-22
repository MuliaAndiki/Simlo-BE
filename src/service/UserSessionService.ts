import prisma from "@/lib/prisma";
import { JwtPayload } from "@/types/auth.types";
import { Response } from "express";
class UserSessionService {
  public async getCurrentUser(res: Response, users: JwtPayload) {
    try {
      const current = await prisma.userSession.findFirst({
        where: {
          userID: users.id,
        },
      });
      if (!current) {
        res.status(400).json({
          status: 400,
          message: "bad request",
        });
        return;
      }

      return { current };
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "service internal error",
        error: error,
      });
      return;
    }
  }
}

export default new UserSessionService();
