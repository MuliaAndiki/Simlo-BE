import path from "path";
import fs from "fs";

let model: any = null;
let isModelLoaded = false;

export const loadMLModel = async () => {
  try {
    const modelPath = path.join(__dirname, "../model/model.json");

    if (!fs.existsSync(modelPath)) {
      console.warn(`  Model file tidak ditemukan di: ${modelPath}`);
      console.warn("   Server tetap berjalan tanpa model ML");
      isModelLoaded = false;
      return;
    }

    console.log("ℹ  Model loading belum dikonfigurasi");
  } catch (error) {
    console.error(" Gagal memuat model:", error);
    isModelLoaded = false;
  }
};

export const getModel = () => model;

export const isModelReady = () => isModelLoaded;
