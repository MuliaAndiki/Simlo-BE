"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middleware/auth");
const ReportService_1 = __importDefault(require("../service/ReportService"));
class ReportController {
    create = [
        auth_1.verifyToken,
        async (req, res) => {
            try {
                const users = req.user;
                if (!users) {
                    res.status(401).json({
                        status: 401,
                        message: "Unauthorized",
                    });
                    return;
                }
                const service = await ReportService_1.default.createReportService(res, req, users);
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
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "server internal error",
                    error: error,
                });
            }
        },
    ];
    delete = [
        auth_1.verifyToken,
        async (req, res) => {
            try {
                const users = req.user;
                if (!users) {
                    res.status(401).json({
                        status: 401,
                        message: "Unauthorized",
                    });
                    return;
                }
                const service = await ReportService_1.default.deleteReportService(req, res, users);
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
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "server internal error",
                    error: error,
                });
                return;
            }
        },
    ];
    update = [
        auth_1.verifyToken,
        async (req, res) => {
            try {
                const users = req.user;
                if (!users) {
                    res.status(401).json({
                        status: 401,
                        message: "Unauthorized",
                    });
                    return;
                }
                const service = await ReportService_1.default.updateReportService(res, req);
                if (!service) {
                    res.status(400).json({
                        status: 400,
                        message: "bad request",
                    });
                    return;
                }
                res.status(200).json({
                    status: 200,
                    message: "successfully update",
                    data: service,
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "server internal error",
                    error: error,
                });
            }
        },
    ];
    updateStatus = [
        auth_1.verifyToken,
        (0, auth_1.RoleBase)("admin"),
        async (req, res) => {
            try {
                const users = req.user;
                if (!users) {
                    res.status(401).json({
                        status: 401,
                        message: "Unauthorized",
                    });
                    return;
                }
                const service = await ReportService_1.default.updateStatusReportService(res, req);
                if (!service) {
                    res.status(400).json({
                        status: 400,
                        message: "bad request",
                    });
                    return;
                }
                res.status(203).json({
                    status: 203,
                    message: "successfully",
                    data: service,
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 500,
                    message: "server internal error ",
                    error: error,
                });
                return;
            }
        },
    ];
}
exports.default = new ReportController();
