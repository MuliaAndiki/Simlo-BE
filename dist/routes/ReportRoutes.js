"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ReportController_1 = __importDefault(require("@/controllers/ReportController"));
class ReportRouter {
    reportRouter;
    constructor() {
        this.reportRouter = express_1.default.Router();
        this.routes();
    }
    routes() {
        this.reportRouter.post("/created", ReportController_1.default.create);
        this.reportRouter.delete("/delete", ReportController_1.default.delete);
    }
}
exports.default = new ReportRouter().reportRouter;
