import { Response, Request } from "express";
import prisma from "@/lib/prisma";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import {
  JwtPayload,
  PickLoginDeveloper,
  PickPatchPicture,
} from "@/types/auth.types";
import { getHeader } from "@/utils/headers";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class AuthService {
  public async loginWithGoogleService(res: Response, req: Request) {
    const { token } = req.body;
    try {
      const tiket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      if (!tiket) {
        res.status(400).json({
          status: 400,
          message: "bad request",
        });
        return;
      }

      const payload: any = tiket.getPayload();

      if (!payload) {
        res.status(400).json({
          status: 400,
          message: "no payload here ",
        });
        return;
      }

      const { email, name, picture } = payload;

      let user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: email || "",
            name: name || "",
            picture: picture || "",

            role: "user",
          },
        });
        return { user };
      }

      if (!process.env.JWT_SECRET) {
        throw new Error(
          "JWT_SECRET is not defined in the environment variables.",
        );
      }

      await prisma.userSession.deleteMany({
        where: {
          userID: user.id,
        },
      });

      const ipAddress =
        getHeader(req.headers["x-forwarded-for"]) ||
        getHeader(req.headers["x-real-ip"]) ||
        getHeader(req.headers["cf-connecting-ip"]) ||
        "unknown";

      const session = await prisma.userSession.create({
        data: {
          userID: user.id,
          userAgent: req.headers["user-agent"] ?? "unknown",
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          ipAddres: ipAddress,
        },
      });

      const payloadJwt: JwtPayload = {
        id: user.id,
        sessionId: session.id,
        name: user.name,
        email: user.email,
        role: "user",
      };

      const tokens = jwt.sign(payloadJwt, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: token,
      });

      return { tokens, user };
    } catch (error) {
      return res.status(500).json({
        message: "service internal error",
        status: 500,
        error: 500,
      });
    }
  }

  public async patchPictureUser(
    req: Request,
    res: Response,
    users: JwtPayload,
  ) {
    try {
      const picture: PickPatchPicture = req.body;

      if (!picture) {
        res.status(404).json({
          status: 404,
          message: "body not found",
        });
        return;
      }

      const patch = await prisma.user.update({
        where: {
          id: users.id,
        },
        data: {
          picture: picture.picture,
        },
      });

      if (!patch) {
        res.status(404).json({
          status: 404,
          message: "prisma error",
        });
        return;
      }

      return { patch };
    } catch (error) {
      return res.status(500).json({
        message: "service internal error",
        status: 500,
        error: error,
      });
    }
  }
  public async LoginDeveloperService(res: Response, req: Request) {
    try {
      const users: PickLoginDeveloper = req.body;

      if (!users.email) {
        res.status(404).json({
          status: 404,
          message: "body not found",
        });
        return;
      }

      const auth = await prisma.user.findFirst({
        where: {
          email: users.email,
        },
        select: {
          id: true,
          name: true,
          role: true,
        },
      });

      if (!auth) {
        res.status(404).json({
          status: 404,
          message: "email not registered",
        });
        return;
      }

      await prisma.userSession.deleteMany({
        where: {
          userID: auth.id,
        },
      });

      const ipAddress =
        getHeader(req.headers["x-forwarded-for"]) ||
        getHeader(req.headers["x-real-ip"]) ||
        getHeader(req.headers["cf-connecting-ip"]) ||
        "unknown";

      const session = await prisma.userSession.create({
        data: {
          userID: auth.id,
          userAgent: req.headers["user-agent"] ?? "unknown",
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          ipAddres: ipAddress,
        },
      });

      const payloadJwt: JwtPayload = {
        id: auth.id,
        sessionId: session.id,
        name: auth.name,
        email: users.email,
        role: auth.role,
      };

      if (!process.env.JWT_SECRET) {
        throw new Error("jwt screet not found");
      }

      const tokens = jwt.sign(payloadJwt, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return { tokens };
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "server internal error",
        error: error,
      });
      return;
    }
  }
}

export default new AuthService();
