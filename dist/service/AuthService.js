"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const headers_1 = require("../utils/headers");
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
            await prisma_1.default.userSession.deleteMany({
                where: {
                    userID: user.id,
                },
            });
            const ipAddress = (0, headers_1.getHeader)(req.headers["x-forwarded-for"]) ||
                (0, headers_1.getHeader)(req.headers["x-real-ip"]) ||
                (0, headers_1.getHeader)(req.headers["cf-connecting-ip"]) ||
                "unknown";
            const session = await prisma_1.default.userSession.create({
                data: {
                    userID: user.id,
                    userAgent: req.headers["user-agent"] ?? "unknown",
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    ipAddres: ipAddress,
                },
            });
            const payloadJwt = {
                id: user.id,
                sessionId: session.id,
                name: user.name,
                email: user.email,
                role: "user",
            };
            const tokens = jsonwebtoken_1.default.sign(payloadJwt, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            await prisma_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: token,
            });
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
    async LoginDeveloperService(res, req) {
        try {
            const users = req.body;
            if (!users.email) {
                res.status(404).json({
                    status: 404,
                    message: "body not found",
                });
                return;
            }
            const auth = await prisma_1.default.user.findFirst({
                where: {
                    email: users.email,
                },
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            });
            if (!auth) {
                res.status(404).json({
                    status: 404,
                    message: "email not registered",
                });
                return;
            }
            await prisma_1.default.userSession.deleteMany({
                where: {
                    userID: auth.id,
                },
            });
            const ipAddress = (0, headers_1.getHeader)(req.headers["x-forwarded-for"]) ||
                (0, headers_1.getHeader)(req.headers["x-real-ip"]) ||
                (0, headers_1.getHeader)(req.headers["cf-connecting-ip"]) ||
                "unknown";
            const session = await prisma_1.default.userSession.create({
                data: {
                    userID: auth.id,
                    userAgent: req.headers["user-agent"] ?? "unknown",
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    ipAddres: ipAddress,
                },
            });
            const payloadJwt = {
                id: auth.id,
                sessionId: session.id,
                name: auth.name,
                email: users.email,
                role: auth.role,
            };
            if (!process.env.JWT_SECRET) {
                throw new Error("jwt screet not found");
            }
            const tokens = jsonwebtoken_1.default.sign(payloadJwt, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            return { tokens };
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
}
exports.default = new AuthService();
