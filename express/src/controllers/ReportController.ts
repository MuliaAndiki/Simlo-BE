import { Request, Response } from "express";
import { JwtPayload } from "@/types/auth.types";
import { RoleBase, verifyToken } from "@/middleware/auth";
import ReportService from "@/service/ReportService";
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

class ReportController {
  public create = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const users: JwtPayload = req.user!;

        if (!users) {
          res.status(401).json({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        const service = await ReportService.createReportService(
          res,
          req,
          users,
        );

        if (!service) {
          return;
        }

        res.status(201).json({
          status: 201,
          message: "successfully create reports",
          data: service,
        });
      } catch (error) {
        if (!res.headersSent) {
          res.status(500).json({
            status: 500,
            message: "server internal error",
            error: error,
          });
        }
      }
    },
  ];
  public delete = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const users: JwtPayload = req.user!;

        if (!users) {
          res.status(401).json({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        const service = await ReportService.deleteReportService(
          req,
          res,
          users,
        );

        if (!service) {
          res.status(400).json({
            status: 400,
            message: "bad request",
          });
          return;
        }

        res.status(203).json({
          status: 203,
          message: "successfully delete report",
          data: service,
        });
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "server internal error",
          error: error,
        });
        return;
      }
    },
  ];

  public update = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const users: JwtPayload = req.user!;

        if (!users) {
          res.status(401).json({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        const service = await ReportService.updateReportService(res, req);

        if (!service) {
          res.status(400).json({
            status: 400,
            message: "bad request",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          message: "successfully update",
          data: service,
        });
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "server internal error",
          error: error,
        });
      }
    },
  ];

  public updateStatus = [
    verifyToken,
    RoleBase("admin"),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const users: JwtPayload = req.user!;

        if (!users) {
          res.status(401).json({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        const service = await ReportService.updateStatusReportService(res, req);

        if (!service) {
          res.status(400).json({
            status: 400,
            message: "bad request",
          });
          return;
        }

        res.status(203).json({
          status: 203,
          message: "successfully",
          data: service,
        });
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "server internal error ",
          error: error,
        });
        return;
      }
    },
  ];
  public getAllReport = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const users = req.user;

        if (!users) {
          res.status(401).json({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        const service = await ReportService.getReportService(res);

        if (!service) {
          res.status(400).json({
            status: 400,
            message: "service bad request",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          message: "successfully get report",
          data: service,
        });
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "server internal error",
          error: error,
        });
        return;
      }
    },
  ];
  public manualLabel = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const users: JwtPayload = req.user!;

        if (!users) {
          res.status(401).json({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        const service = await ReportService.manualLabelReportService(
          res,
          req,
          users,
        );

        if (!service) {
          return;
        }

        res.status(200).json({
          status: 200,
          message: "Labeling manual jalan berlobang berhasil disimpan",
          data: service,
        });
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "server internal error",
          error: error,
        });
      }
    },
  ];

  public getReportById = [
    verifyToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const users = req.user;
        const { id } = req.params;

        if (!users) {
          res.status(401).json({
            status: 401,
            message: "Unauthorized",
          });
          return;
        }

        if (!id) {
          res.status(404).json({
            status: 404,
            message: "params not found",
          });
          return;
        }

        const service = await ReportService.getReportServiceByID(res, id);

        if (!service) {
          res.status(400).json({
            status: 400,
            message: "service bad request",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          message: "successfully get report byID",
          data: service,
        });
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "server internal error",
          error: error,
        });
        return;
      }
    },
  ];
}

export default new ReportController();
