import { RoleType, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/types/auth.types";
import { JWT_SECRET } from "./constants";

export async function createUser(input?: {
  email?: string;
  name?: string;
  picture?: string;
  role?: RoleType;
}) {
  return prisma.user.create({
    data: {
      email: input?.email ?? "user@example.com",
      name: input?.name ?? "Test User",
      picture: input?.picture ?? "https://example.com/avatar.png",
      role: input?.role ?? RoleType.user,
    },
  });
}

export async function createSession(userId: string) {
  return prisma.userSession.create({
    data: {
      userID: userId,
      userAgent: "vitest-agent",
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ipAddres: "127.0.0.1",
    },
  });
}

export async function issueToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function loginAsUser(input?: { email?: string; role?: RoleType }) {
  const user = await createUser(input);
  return loginAsExistingUser(user);
}

export async function loginAsExistingUser(user: User) {
  const session = await createSession(user.id);
  const token = await issueToken({
    id: user.id,
    sessionId: session.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return { user, session, token };
}

export async function createReportWithMl(
  userId: string,
  options?: { isDetected?: boolean },
) {
  const report = await prisma.report.create({
    data: {
      userID: userId,
      image_url: "https://example.com/pothole.jpg",
      latitude: -6.2,
      longitude: 106.8,
      city: "Jakarta",
      address_detail: "Jl. Test",
      reportStatus: "isPending",
    },
  });

  const mlResult = await prisma.mlResult.create({
    data: {
      reportID: report.id,
      is_Detected: options?.isDetected ?? false,
      confidenceScore: 0.2,
      model_version: "v1.0.0",
      processed_at: new Date(),
    },
  });

  return { report, mlResult };
}
