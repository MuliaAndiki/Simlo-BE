"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
async function connected() {
    console.log("Memulai inisialisasi server...");
    try {
        console.log("Mencoba koneksi database...");
        await (0, database_1.connectWithRetry)();
        console.log("Database terkoneksi!");
        app_1.default.listen(port, "0.0.0.0", () => {
            console.log(`Server aktif di port: ${port}`);
        });
    }
    catch (error) {
        console.error("Gagal total:", error);
        process.exit(1);
    }
}
connected();
