import app from "./app";
import { connectWithRetry } from "./config/database";

const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const mlServiceUrl = process.env.ML_SERVICE_URL ?? "http://localhost:8000";

async function connected() {
  console.log("Memulai inisialisasi server...");
  try {
    console.log("Mencoba koneksi database...");
    await connectWithRetry();
    console.log("Database terkoneksi!");
    console.log(`ML proxy mengarah ke: ${mlServiceUrl}`);

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server aktif di port: ${port}`);
    });
  } catch (error) {
    console.error("Gagal total:", error);
    process.exit(1);
  }
}

connected();
