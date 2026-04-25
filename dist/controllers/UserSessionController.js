"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middleware/auth");
const UserSessionService_1 = __importDefault(require("../service/UserSessionService"));
class UserSessionController {
    curentUser = [
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
                const service = await UserSessionService_1.default.getCurrentUser(res, users);
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
}
exports.default = new UserSessionController();
