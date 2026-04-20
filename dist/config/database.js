"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectWithRetry = connectWithRetry;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function connectWithRetry(retries = 5, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            await prisma.$connect();
            console.log("✅ Database connected successfully!");
            return prisma;
        }
        catch (err) {
            console.error(`⏳ Failed to connect (attempt ${i + 1}/${retries})`);
            if (i === retries - 1) {
                console.error("❌ All retry attempts failed");
                throw err;
            }
            await new Promise((r) => setTimeout(r, delay));
        }
    }
}
