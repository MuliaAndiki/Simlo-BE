"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/lib/prisma"));
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class AuthService {
    async loginWithGoogleService(res, req) {
        const { token } = req.body;
        try {
            const tiket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            if (!tiket) {
                res.status(400).json({
                    status: 400,
                    message: "bad request",
                });
                return;
            }
            const payload = tiket.getPayload();
            if (!payload) {
                res.status(400).json({
                    status: 400,
                    message: "no payload here ",
                });
                return;
            }
            const { email, name, picture } = payload;
            let user = await prisma_1.default.user.findFirst({
                where: {
                    email: email,
                },
            });
            if (!user) {
                user = await prisma_1.default.user.create({
                    data: {
                        email: email || "",
                        name: name || "",
                        picture: picture || "",
                        role: "user",
                    },
                });
                return { user };
            }
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined in the environment variables.");
            }
            const tokens = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, picture: user.picture }, process.env.JWT_SECRET, { expiresIn: "7d" });
            return { tokens, user };
        }
        catch (error) {
            return res.status(500).json({
                message: "service internal error",
                status: 500,
                error: 500,
            });
        }
    }
    async patchPictureUser(req, res, users) {
        try {
            const picture = req.body;
            if (!picture) {
                res.status(404).json({
                    status: 404,
                    message: "body not found",
                });
                return;
            }
            const patch = await prisma_1.default.user.update({
                where: {
                    id: users.id,
                },
                data: {
                    picture: picture.picture,
                },
            });
            if (!patch) {
                res.status(404).json({
                    status: 404,
                    message: "prisma error",
                });
                return;
            }
            return { patch };
        }
        catch (error) {
            return res.status(500).json({
                message: "service internal error",
                status: 500,
                error: error,
            });
        }
    }
}
exports.default = new AuthService();
