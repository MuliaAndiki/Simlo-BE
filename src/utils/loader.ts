import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import * as tf from "@tensorflow/tfjs-node";

let model: tf.GraphModel | null = null;
let isModelLoaded = false;

export const loadMLModel = async () => {
  try {
    const modelPath = path.resolve(__dirname, "../model/model.json");

    if (!fs.existsSync(modelPath)) {
      console.warn(`  Model file tidak ditemukan di: ${modelPath}`);
      console.warn("   Server tetap berjalan tanpa model ML");
      model = null;
      isModelLoaded = false;
      return;
    }

    model = await tf.loadGraphModel(pathToFileURL(modelPath).href);
    isModelLoaded = true;
    console.log(`ℹ  Model ML berhasil dimuat dari: ${modelPath}`);
  } catch (error) {
    console.error(" Gagal memuat model:", error);
    model = null;
    isModelLoaded = false;
  }
};

export const getModel = () => model;

export const isModelReady = () => isModelLoaded;
