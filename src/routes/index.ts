import app from "@/app";
import AuthRouter from "./AuthRouter";

export function Routes() {
  app.use("/api/auth", AuthRouter);
}
