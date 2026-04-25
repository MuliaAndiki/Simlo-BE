"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserSessionController_1 = __importDefault(require("../controllers/UserSessionController"));
const express_1 = __importDefault(require("express"));
class UserSessionRoutes {
    userSessionRouter;
    constructor() {
        this.userSessionRouter = express_1.default.Router();
        this.routes();
    }
    routes() {
        this.userSessionRouter.get("/current", UserSessionController_1.default.curentUser);
    }
}
exports.default = new UserSessionRoutes().userSessionRouter;
