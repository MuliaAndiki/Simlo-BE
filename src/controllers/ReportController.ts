import { Request, Response } from "express";
import { JwtPayload } from "@/types/auth.types";
import { verifyToken } from "@/middleware/auth";
import ReportService from "@/service/ReportService";
import prisma from "@/lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

class ReportController {
  public create = [
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

        const service = await ReportService.createReportService(
          res,
          req,
          users,
        );

        if (!service) {
          res.status(400).json({
            status: 400,
            message: "bad request service",
          });
          return;
        }

        res.status(201).json({
          status: 201,
          message: "successfully create reports",
          data: service,
        });
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "server internal error",
          error: error,
        });
      }
    },
  ];
  public delete = [
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

        const service = await ReportService.deleteReportService(
          req,
          res,
          users,
        );

        if (!service) {
          res.status(400).json({
            status: 400,
            message: "bad request",
          });
          return;
        }

        res.status(203).json({
          status: 203,
          message: "successfully delete report",
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

export default new ReportController();
