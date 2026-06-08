import { RoleType } from "@prisma/client";

export interface TAuth {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: RoleType;
  password: string;
  sessionId: string;
}

export type JwtPayload = Pick<
  TAuth,
  "id" | "email" | "name" | "role" | "sessionId"
>;
export type PickPatchPicture = Pick<TAuth, "picture">;
export type PickLoginDeveloper = Pick<TAuth, "email">;
