"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = __importDefault(require("@/service/AuthService"));
const auth_1 = require("@/middleware/auth");
class AuthController {
    loginGoogle = async (req, res) => {
        try {
            const service = await AuthService_1.default.loginWithGoogleService(res, req);
            if (!service) {
                res.status(400).json({
                    status: 400,
                    message: "bad request",
                });
                return;
            }
            res.status(200).json({
                status: 200,
                message: "successfully login with google",
                data: service,
            });
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: "Internal server error",
                error: error,
            });
            return;
        }
    };
    patchPictureUser = [
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
                const service = await AuthService_1.default.patchPictureUser(req, res, users);
                if (!service) {
                    res.status(400).json({
                        status: 400,
                        message: "bad request",
                    });
                    return;
                }
                res.status(200).json({
                    status: 203,
                    message: "successfully update Picture",
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
exports.default = new AuthController();
