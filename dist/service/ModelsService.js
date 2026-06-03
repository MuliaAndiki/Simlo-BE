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
Object.defineProperty(exports, "__esModule", { value: true });
require("@tensorflow/tfjs-node");
const tf = __importStar(require("@tensorflow/tfjs-node"));
const loader_1 = require("../utils/loader");
class MlClassServive {
    async processImageToTensor(imageUrl) {
        const download = await fetch(imageUrl);
        if (!download.ok) {
            throw new Error("Image download failed");
        }
        const arrayBuffer = await download.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        return tf.tidy(() => {
            return tf.node
                .decodeImage(imageBuffer, 3)
                .resizeBilinear([224, 224])
                .expandDims(0)
                .toFloat()
                .div(255.0);
        });
    }
    async GetPrediction(imageUrl, res) {
        try {
            if (!(0, loader_1.isModelReady)()) {
                res.status(503).json({
                    status: 503,
                    message: "models not loader",
                });
                return;
            }
            const model = (0, loader_1.getModel)();
            const tensor = await this.processImageToTensor(imageUrl);
            if (!model) {
                res.status(503).json({
                    status: 503,
                    message: "models not loader",
                });
                tensor.dispose();
                return;
            }
            const prediction = await model.executeAsync(tensor);
            const outputTensor = Array.isArray(prediction)
                ? prediction[0]
                : prediction;
            const rawScores = await outputTensor.data();
            tensor.dispose();
            if (Array.isArray(prediction)) {
                prediction.forEach((item) => item.dispose());
            }
            else {
                prediction.dispose();
            }
            const topScore = Math.max(...Array.from(rawScores));
            const isDetected = topScore > 0.5;
            const result = {
                is_Detected: isDetected,
                confidenceScore: parseFloat(topScore.toFixed(2)),
                model_version: "v1.0.0",
                processed_at: new Date(),
                boundingBoxes: [],
            };
            return result;
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: "model internal error",
                error: error,
            });
            return;
        }
    }
}
exports.default = new MlClassServive();
