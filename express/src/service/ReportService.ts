import prisma from "@/lib/prisma";
import { JwtPayload } from "@/types/auth.types";
import { ManualLabelPayload, IBoundingBox } from "@/types/ml.types";
import { PickCreateReport, PickStatusReport } from "@/types/report.types";
import { Response, Request } from "express";
import ModelsService, { MlServiceError } from "./ModelsService";
import {
  getReportStatusOptions,
  parseReportStatus,
} from "@/utils/reportStatus";
import { uploadAnnotatedMlImage } from "@/utils/mlImage";

const MANUAL_MODEL_VERSION = "manual-v1.0.0";
const DEFAULT_POTHOLE_LABEL = "berlubang";

function isValidBoundingBox(box: IBoundingBox): boolean {
  const coords = [box.x, box.y, box.width, box.height];
  return coords.every(
    (value) =>
      typeof value === "number" && Number.isFinite(value) && value >= 0,
  );
}
class ReportService {
  public async createReportService(
    res: Response,
    req: Request,
    users: JwtPayload,
  ) {
    try {
      const reports: PickCreateReport = req.body;
      const reportStatus = parseReportStatus(reports.reportStatus);

      if (
        !reports.address_detail ||
        !reports.city ||
        !reports.image_url ||
        typeof reports.latitude !== "number" ||
        typeof reports.longitude !== "number" ||
        !Number.isFinite(reports.latitude) ||
        !Number.isFinite(reports.longitude) ||
        !reportStatus
      ) {
        res.status(400).json({
          status: 400,
          message: reportStatus
            ? "Data laporan tidak lengkap atau tidak valid"
            : `reportStatus tidak valid. Gunakan salah satu: ${getReportStatusOptions().join(", ")} (atau alias: PENDING, IN_PROGRESS, DONE, REJECTED)`,
          errors: {
            reportStatus: reportStatus
              ? undefined
              : `Nilai "${reports.reportStatus}" tidak dikenali`,
          },
        });
        return;
      }

      const createed = await prisma.report.create({
        data: {
          city: reports.city,
          address_detail: reports.address_detail,
          image_url: reports.image_url,
          latitude: reports.latitude,
          longitude: reports.longitude,
          reportStatus,
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

      let prediction;
      try {
        prediction = await ModelsService.GetPrediction(createed.image_url);
      } catch (error) {
        await prisma.report.delete({ where: { id: createed.id } });

        if (error instanceof MlServiceError) {
          res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
            error: error.details,
          });
          return;
        }

        throw error;
      }

      let annotatedImageUrl: string | null = null;

      if (prediction.annotated_image_base64) {
        try {
          annotatedImageUrl = await uploadAnnotatedMlImage(
            prediction.annotated_image_base64,
            createed.id,
          );
        } catch (uploadError) {
          console.error("Gagal upload gambar hasil ML ke Cloudinary:", uploadError);
        }
      }

      const resultModels = await prisma.mlResult.create({
        data: {
          reportID: createed.id,
          is_Detected: prediction.is_Detected,
          confidenceScore: prediction.confidenceScore,
          model_version: prediction.model_version,
          processed_at: prediction.processed_at,
          annotated_image_url: annotatedImageUrl,
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

      const reportStatus = parseReportStatus(reports.reportStatus);

      if (!reportStatus) {
        res.status(400).json({
          status: 400,
          message: `reportStatus tidak valid. Gunakan salah satu: ${getReportStatusOptions().join(", ")}`,
        });
        return;
      }

      const status = await prisma.report.update({
        where: {
          id: id,
        },
        data: {
          reportStatus,
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
        include: {
          ml: {
            orderBy: { processed_at: "desc" },
            include: { boundingbox: true },
          },
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
  public async manualLabelReportService(
    res: Response,
    req: Request,
    users: JwtPayload,
  ) {
    try {
      const { id } = req.params;
      const payload: ManualLabelPayload = req.body;

      if (!id) {
        res.status(404).json({
          status: 404,
          message: "Parameter laporan tidak ditemukan",
        });
        return;
      }

      if (
        !payload?.boundingBoxes ||
        !Array.isArray(payload.boundingBoxes) ||
        payload.boundingBoxes.length === 0
      ) {
        res.status(400).json({
          status: 400,
          message: "Minimal satu bounding box diperlukan untuk labeling manual",
        });
        return;
      }

      const normalizedBoxes = payload.boundingBoxes.map((box) => ({
        x: box.x,
        y: box.y,
        height: box.height,
        width: box.width,
        label: box.label?.trim() || DEFAULT_POTHOLE_LABEL,
      }));

      if (!normalizedBoxes.every(isValidBoundingBox)) {
        res.status(400).json({
          status: 400,
          message:
            "Koordinat bounding box tidak valid. Pastikan x, y, width, dan height berupa angka non-negatif",
        });
        return;
      }

      const report = await prisma.report.findUnique({
        where: { id },
        include: {
          ml: {
            orderBy: { processed_at: "desc" },
            take: 1,
            include: { boundingbox: true },
          },
        },
      });

      if (!report) {
        res.status(404).json({
          status: 404,
          message: "Laporan tidak ditemukan",
        });
        return;
      }

      const isOwner = report.userID === users.id;
      const isAdmin = users.role === "admin";

      if (!isOwner && !isAdmin) {
        res.status(403).json({
          status: 403,
          message: "Anda tidak memiliki akses untuk melabeli laporan ini",
        });
        return;
      }

      const mlResult = report.ml[0];

      if (!mlResult) {
        res.status(404).json({
          status: 404,
          message: "Hasil ML untuk laporan ini belum tersedia",
        });
        return;
      }

      if (mlResult.is_Detected && !isAdmin) {
        res.status(409).json({
          status: 409,
          message:
            "Laporan sudah terdeteksi oleh model. Labeling manual hanya untuk gambar yang tidak terdeteksi",
        });
        return;
      }

      const confidenceScore =
        typeof payload.confidenceScore === "number" &&
        payload.confidenceScore >= 0 &&
        payload.confidenceScore <= 1
          ? payload.confidenceScore
          : 1;

      const updatedMlResult = await prisma.$transaction(async (tx) => {
        await tx.boundingBox.deleteMany({
          where: { mlResultID: mlResult.id },
        });

        return tx.mlResult.update({
          where: { id: mlResult.id },
          data: {
            is_Detected: true,
            confidenceScore,
            model_version: MANUAL_MODEL_VERSION,
            processed_at: new Date(),
            boundingbox: {
              create: normalizedBoxes,
            },
          },
          include: {
            boundingbox: true,
          },
        });
      });

      return {
        report: {
          id: report.id,
          image_url: report.image_url,
          reportStatus: report.reportStatus,
        },
        mlResult: updatedMlResult,
      };
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan saat menyimpan labeling manual",
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
        include: {
          ml: {
            orderBy: { processed_at: "desc" },
            include: { boundingbox: true },
          },
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
