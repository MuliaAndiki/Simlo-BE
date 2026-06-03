"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
const ModelsService_1 = __importDefault(require("./ModelsService"));
const MANUAL_MODEL_VERSION = "manual-v1.0.0";
const DEFAULT_POTHOLE_LABEL = "berlubang";
function isValidBoundingBox(box) {
    const coords = [box.x, box.y, box.width, box.height];
    return coords.every((value) => typeof value === "number" && Number.isFinite(value) && value >= 0);
}
class ReportService {
    async createReportService(res, req, users) {
        try {
            const reports = req.body;
            if (!reports.address_detail ||
                !reports.city ||
                !reports.image_url ||
                !reports.latitude ||
                !reports.longitude ||
                !reports.reportStatus) {
                res.status(404).json({
                    status: 404,
                    message: "body not found",
                });
            }
            const createed = await prisma_1.default.report.create({
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
            const prediction = await ModelsService_1.default.GetPrediction(createed.image_url, res);
            if (!prediction) {
                res.status(500).json({
                    status: 500,
                    message: "ml service error",
                });
                return;
            }
            const resultModels = await prisma_1.default.mlResult.create({
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
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: "server internal error",
                error: error,
            });
            return;
        }
    }
    async deleteReportService(req, res, users) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(404).json({
                    status: 404,
                    message: "params not found ",
                });
                return;
            }
            const status = await prisma_1.default.report.findFirst({
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
            const deleted = await prisma_1.default.report.delete({
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
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: "server internal error",
                error: error,
            });
            return;
        }
    }
    async updateReportService(res, req) {
        try {
            const reports = req.body;
            const { id } = req.params;
            if (!id) {
                res.status(404).json({
                    status: 404,
                    message: "params not found",
                });
                return;
            }
            const updated = await prisma_1.default.report.update({
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
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: "service internal error",
                error: error,
            });
            return;
        }
    }
    async updateStatusReportService(res, req) {
        try {
            const reports = req.body;
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
            const status = await prisma_1.default.report.update({
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
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: "service internal error",
                error: error,
            });
            return;
        }
    }
    async getReportService(res) {
        try {
            const getAllReport = await prisma_1.default.report.findMany({
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
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: "service internal error",
                error: error,
            });
            return;
        }
    }
    async manualLabelReportService(res, req, users) {
        try {
            const { id } = req.params;
            const payload = req.body;
            if (!id) {
                res.status(404).json({
                    status: 404,
                    message: "Parameter laporan tidak ditemukan",
                });
                return;
            }
            if (!payload?.boundingBoxes ||
                !Array.isArray(payload.boundingBoxes) ||
                payload.boundingBoxes.length === 0) {
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
                    message: "Koordinat bounding box tidak valid. Pastikan x, y, width, dan height berupa angka non-negatif",
                });
                return;
            }
            const report = await prisma_1.default.report.findUnique({
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
                    message: "Laporan sudah terdeteksi oleh model. Labeling manual hanya untuk gambar yang tidak terdeteksi",
                });
                return;
            }
            const confidenceScore = typeof payload.confidenceScore === "number" &&
                payload.confidenceScore >= 0 &&
                payload.confidenceScore <= 1
                ? payload.confidenceScore
                : 1;
            const updatedMlResult = await prisma_1.default.$transaction(async (tx) => {
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
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: "Terjadi kesalahan saat menyimpan labeling manual",
                error: error,
            });
            return;
        }
    }
    async getReportServiceByID(res, id) {
        try {
            const getReportById = await prisma_1.default.report.findUnique({
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
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: "service internal error",
                error: error,
            });
        }
    }
}
exports.default = new ReportService();
