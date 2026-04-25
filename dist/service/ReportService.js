"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
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
            //handler post foto
            // prisma
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
            return { createed };
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
}
exports.default = new ReportService();
