"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModelReady = exports.getModel = exports.loadMLModel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const tf = __importStar(require("@tensorflow/tfjs-node"));
let model = null;
let isModelLoaded = false;
const loadMLModel = async () => {
    try {
        const modelPath = path_1.default.resolve(__dirname, "../model/model.json");
        if (!fs_1.default.existsSync(modelPath)) {
            console.warn(`  Model file tidak ditemukan di: ${modelPath}`);
            console.warn("   Server tetap berjalan tanpa model ML");
            model = null;
            isModelLoaded = false;
            return;
        }
        model = await tf.loadGraphModel((0, url_1.pathToFileURL)(modelPath).href);
        isModelLoaded = true;
        console.log(`ℹ  Model ML berhasil dimuat dari: ${modelPath}`);
    }
    catch (error) {
        console.error(" Gagal memuat model:", error);
        model = null;
        isModelLoaded = false;
    }
};
exports.loadMLModel = loadMLModel;
const getModel = () => model;
exports.getModel = getModel;
const isModelReady = () => isModelLoaded;
exports.isModelReady = isModelReady;
