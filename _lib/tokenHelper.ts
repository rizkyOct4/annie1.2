import { jwtVerify } from "jose";
import { JWT_SECRET } from "./config";

export const TokenHelper = async (token?: string) => {
  try {
    if (!token) return null;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    const publicId = payload.publicId as string;
    const role = payload.role as string;
    return { publicId, role };
  } catch {
    return null;
  }
};
