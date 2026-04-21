import { RoleType } from "@prisma/client";

export interface TAuth {
  id: string;
  email: string;
  fullName: string;
  picture: string;
  role: RoleType;
  password: string;
}

export type JwtPayload = Pick<TAuth, "id" | "email" | "fullName" | "role">;
export type PickPatchPicture = Pick<TAuth, "picture">;
