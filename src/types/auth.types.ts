import { RoleType } from "@prisma/client";

export interface TAuth {
  id: string;
  email: string;
  fullName: string;
  picture: string;
  role: RoleType;
  password: string;
  sessionId: string;
}

export type JwtPayload = Pick<
  TAuth,
  "id" | "email" | "fullName" | "role" | "sessionId"
>;
export type PickPatchPicture = Pick<TAuth, "picture">;
