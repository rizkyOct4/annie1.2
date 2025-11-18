import { cookies } from "next/headers";

export const Cookies = async () => {
  const cookieHeader = (await cookies()).toString() ?? {};

  return cookieHeader;
};
