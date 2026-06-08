import express, { Application, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import ReportRoutes from "./routes/ReportRoutes";
import swaggerSpec from "./swagger";
import AuthRouter from "./routes/AuthRouter";
import UserSessionRoutes from "./routes/UserSessionRoutes";
import MlRoutes from "./routes/MlRoutes";
import hpp from "hpp";
import helmet from "helmet";
import { verifyInternalApiKey } from "./middleware/apiKey";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(helmet());
    this.app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(express.json());
    this.app.use(hpp());
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.app.use("/", verifyInternalApiKey);
  }

  private routes(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.json({
        message: "Simlo API!",
        timestamp: new Date().toISOString(),
      });
    });
    this.app.use("/api/auth", AuthRouter);
    this.app.use("/api/report", ReportRoutes);
    this.app.use("/api/session", UserSessionRoutes);
    this.app.use("/api/ml", MlRoutes);
  }
}

export default new App().app;
