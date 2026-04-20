import app from "./app";
import { connectWithRetry } from "./config/database";
import { env } from "./config/env.config";
const port = Number.isFinite(env.PORT) ? env.PORT : 5000;

async function connected() {
  try {
    await connectWithRetry();

    app.listen(
      {
        port,
        hostname: "0.0.0.0",
      },
      () => {
        console.log(`Express running at http://localhost:${port}`);
      },
    );
  } catch (error) {
    console.error(" Could not connect to database after retries:", error);
    process.exit(1);
  }
}

connected();
