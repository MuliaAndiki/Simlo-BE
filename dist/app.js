"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const ReportRoutes_1 = __importDefault(require("./routes/ReportRoutes"));
const swagger_1 = __importDefault(require("./swagger"));
const AuthRouter_1 = __importDefault(require("./routes/AuthRouter"));
const UserSessionRoutes_1 = __importDefault(require("./routes/UserSessionRoutes"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const apiKey_1 = require("./middleware/apiKey");
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({ origin: "*", optionsSuccessStatus: 200 }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.json());
        this.app.use(express_1.default.json());
        this.app.use((0, hpp_1.default)());
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
        this.app.use("/", apiKey_1.verifyInternalApiKey);
    }
    routes() {
        this.app.get("/", (req, res) => {
            res.json({
                message: "Simlo API!",
                timestamp: new Date().toISOString(),
            });
        });
        this.app.use("/api/auth", AuthRouter_1.default);
        this.app.use("/api/report", ReportRoutes_1.default);
        this.app.use("/api/session", UserSessionRoutes_1.default);
    }
}
exports.default = new App().app;
