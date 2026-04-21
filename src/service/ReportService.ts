import prisma from "@/lib/prisma";
import { JwtPayload } from "@/types/auth.types";
import { PickCreateReport, PickDeleteReport } from "@/types/report.types";
import { Response, Request } from "express";
class ReportService {
  public async createReportService(
    res: Response,
    req: Request,
    users: JwtPayload,
  ) {
    try {
      const reports: PickCreateReport = req.body;

      if (
        !reports.address_detail ||
        !reports.city ||
        !reports.image_url ||
        !reports.latitude ||
        !reports.longitude ||
        !reports.reportStatus
      ) {
        res.status(404).json({
          status: 404,
          message: "body not found",
        });
      }
      //handler post foto

      // prisma
      const createed = await prisma.report.create({
        data: {
          city: reports.city,
          address_detail: reports.address_detail,
          image_url: reports.image_url,
          latitude: reports.latitude,
          longitude: reports.longitude,
          reportStatus: reports.reportStatus,
          userID: users.id,
        },
      });

      if (!createed) {
        res.status(400).json({
          status: 400,
          message: "prisma error",
        });
        return;
      }

      return { createed };
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "server internal error",
        error: error,
      });
      return;
    }
  }

  public async deleteReportService(
    req: Request,
    res: Response,
    users: JwtPayload,
  ) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(404).json({
          status: 404,
          message: "params not found ",
        });
        return;
      }

      const status = await prisma.report.findFirst({
        where: {
          userID: users.id,
        },
        select: {
          reportStatus: true,
        },
      });

      if (!status || status.reportStatus !== "done") {
        res.status(400).json({
          status: 400,
          message: "bad request ",
        });
        return;
      }

      const deleted = await prisma.report.delete({
        where: {
          id: id,
          userID: users.id,
        },
      });

      if (!deleted) {
        res.status(400).json({
          status: 400,
          message: "prisma bad request",
        });
        return;
      }

      return { deleted };
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "server internal error",
        error: error,
      });
      return;
    }
  }
}

export default new ReportService();
