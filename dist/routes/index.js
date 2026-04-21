"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = Routes;
const app_1 = __importDefault(require("@/app"));
const AuthRouter_1 = __importDefault(require("./AuthRouter"));
function Routes() {
    app_1.default.use("/api/auth", AuthRouter_1.default);
}
