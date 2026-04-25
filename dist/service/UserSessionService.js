"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class UserSessionService {
    async getCurrentUser(res, users) {
        try {
            const current = await prisma_1.default.userSession.findFirst({
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
exports.default = new UserSessionService();
