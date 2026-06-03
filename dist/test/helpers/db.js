"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.createSession = createSession;
exports.issueToken = issueToken;
exports.loginAsUser = loginAsUser;
exports.loginAsExistingUser = loginAsExistingUser;
exports.createReportWithMl = createReportWithMl;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
async function createUser(input) {
    return prisma_1.default.user.create({
        data: {
            email: input?.email ?? "user@example.com",
            name: input?.name ?? "Test User",
            picture: input?.picture ?? "https://example.com/avatar.png",
            role: input?.role ?? client_1.RoleType.user,
        },
    });
}
async function createSession(userId) {
    return prisma_1.default.userSession.create({
        data: {
            userID: userId,
            userAgent: "vitest-agent",
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
            ipAddres: "127.0.0.1",
        },
    });
}
async function issueToken(payload) {
    return jsonwebtoken_1.default.sign(payload, constants_1.JWT_SECRET, { expiresIn: "7d" });
}
async function loginAsUser(input) {
    const user = await createUser(input);
    return loginAsExistingUser(user);
}
async function loginAsExistingUser(user) {
    const session = await createSession(user.id);
    const token = await issueToken({
        id: user.id,
        sessionId: session.id,
        name: user.name,
        email: user.email,
        role: user.role,
    });
    return { user, session, token };
}
async function createReportWithMl(userId, options) {
    const report = await prisma_1.default.report.create({
        data: {
            userID: userId,
            image_url: "https://example.com/pothole.jpg",
            latitude: -6.2,
            longitude: 106.8,
            city: "Jakarta",
            address_detail: "Jl. Test",
            reportStatus: "isPending",
        },
    });
    const mlResult = await prisma_1.default.mlResult.create({
        data: {
            reportID: report.id,
            is_Detected: options?.isDetected ?? false,
            confidenceScore: 0.2,
            model_version: "v1.0.0",
            processed_at: new Date(),
        },
    });
    return { report, mlResult };
}
