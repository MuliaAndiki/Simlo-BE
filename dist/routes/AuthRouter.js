"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
class AuthRouter {
    authRouter;
    constructor() {
        this.authRouter = express_1.default.Router();
        this.routes();
    }
    routes() {
        this.authRouter.post("/google", AuthController_1.default.loginGoogle);
        this.authRouter.patch("/picture", AuthController_1.default.patchPictureUser);
        this.authRouter.post("/developer", AuthController_1.default.loginDeveloper);
    }
}
exports.default = new AuthRouter().authRouter;
