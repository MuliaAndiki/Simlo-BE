"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyInternalApiKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
const verifyInternalApiKey = (req, res, next) => {
    try {
        const clientKey = req.headers["x-internal-api-key"];
        const serverKey = process.env.INTERNAL_API_SECRET;
        if (!clientKey) {
            res.status(401).json({
                status: 401,
                message: "Missing internal API key",
            });
            return;
        }
        if (!serverKey) {
            throw new Error("INTERNAL_API_SECRET is not defined");
        }
        const clientBuffer = Buffer.from(clientKey);
        const serverBuffer = Buffer.from(serverKey);
        if (clientBuffer.length !== serverBuffer.length) {
            res.status(403).json({
                status: 403,
                message: "Invalid internal API key",
            });
            return;
        }
        const isMatch = crypto_1.default.timingSafeEqual(clientBuffer, serverBuffer);
        if (!isMatch) {
            res.status(403).json({
                status: 403,
                message: "Invalid internal API key",
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal API authentication error",
        });
    }
};
exports.verifyInternalApiKey = verifyInternalApiKey;
