import { Response, Request } from "express";
import prisma from "@/lib/prisma";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { JwtPayload, PickPatchPicture } from "@/types/auth.types";

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

      const tokens = jwt.sign(
        { id: user.id, email: user.email, picture: user.picture },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

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
}

export default new AuthService();
