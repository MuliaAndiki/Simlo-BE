import prisma from "@/lib/prisma";
import { JwtPayload } from "@/types/auth.types";
import { PickCreateReport, PickStatusReport } from "@/types/report.types";
import { Response, Request } from "express";
import ModelsService from "./ModelsService";
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

      const prediction = await ModelsService.GetPrediction(
        createed.image_url,
        res,
      );

      if (!prediction) {
        res.status(500).json({
          status: 500,
          message: "ml service error",
        });
        return;
      }

      const resultModels = await prisma.mlResult.create({
        data: {
          reportID: createed.id,
          is_Detected: prediction.is_Detected,
          confidenceScore: prediction.confidenceScore,
          model_version: prediction.model_version,
          processed_at: prediction.processed_at,
          boundingbox: {
            create: prediction.boundingBoxes.map((box) => ({
              x: box.x,
              height: box.height,
              label: box.label,
              width: box.width,
              y: box.y,
            })),
          },
        },
        include: {
          boundingbox: true,
        },
      });

      return { createed, resultModels };
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
  public async updateReportService(res: Response, req: Request) {
    try {
      const reports: PickCreateReport = req.body;
      const { id } = req.params;

      if (!id) {
        res.status(404).json({
          status: 404,
          message: "params not found",
        });
        return;
      }

      const updated = await prisma.report.update({
        where: {
          id: id,
        },
        data: reports,
      });

      if (!updated) {
        res.status(400).json({
          status: 400,
          message: "prisma bad requst",
        });
        return;
      }

      return { updated };
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "service internal error",
        error: error,
      });
      return;
    }
  }
  public async updateStatusReportService(res: Response, req: Request) {
    try {
      const reports: PickStatusReport = req.body;
      const { id } = req.params;

      if (!id) {
        res.status(404).json({
          status: 404,
          message: "params not found",
        });
        return;
      }

      if (!reports.reportStatus) {
        res.status(404).json({
          status: 404,
          message: "body not found",
        });
        return;
      }

      const status = await prisma.report.update({
        where: {
          id: id,
        },
        data: {
          reportStatus: reports.reportStatus,
        },
      });

      if (!status) {
        res.status(400).json({
          status: 400,
          message: "bad request",
        });

        return;
      }

      return { status };
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "service internal error",
        error: error,
      });
      return;
    }
  }
  public async getReportService(res: Response) {
    try {
      const getAllReport = await prisma.report.findMany({
        orderBy: {
          created_at: "asc",
        },
      });

      if (!getAllReport) {
        res.status(400).json({
          status: 400,
          message: "query get report error",
        });
        return;
      }

      return getAllReport;
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "service internal error",
        error: error,
      });
      return;
    }
  }
  public async getReportServiceByID(res: Response, id: string) {
    try {
      const getReportById = await prisma.report.findUnique({
        where: {
          id: id,
        },
      });

      if (!getReportById) {
        res.status(400).json({
          status: 400,
          message: "bad request",
        });
        return;
      }

      return getReportById;
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "service internal error",
        error: error,
      });
    }
  }
}

export default new ReportService();
