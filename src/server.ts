import app from "./app";
import { connectWithRetry } from "./config/database";
import { loadMLModel } from "./utils/loader";
const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

async function connected() {
  console.log("Memulai inisialisasi server...");
  try {
    console.log("Mencoba koneksi database...");
    await connectWithRetry();
    await loadMLModel();
    console.log("Database terkoneksi!");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server aktif di port: ${port}`);
    });
  } catch (error) {
    console.error("Gagal total:", error);
    process.exit(1);
  }
}

connected();
