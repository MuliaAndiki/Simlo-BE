"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const env_config_1 = require("./config/env.config");
const port = Number.isFinite(env_config_1.env.PORT) ? env_config_1.env.PORT : 5000;
async function connected() {
    try {
        await (0, database_1.connectWithRetry)();
        app_1.default.listen({
            port,
            hostname: "0.0.0.0",
        }, () => {
            console.log(`Express running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error(" Could not connect to database after retries:", error);
        process.exit(1);
    }
}
connected();
