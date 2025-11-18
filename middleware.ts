import { NextRequest, NextResponse } from "next/server";
import { TokenHelper } from "./_lib/tokenHelper";
import ProfilePath from "./_lib/middleware/profile";
import { VerifyToken, PublicPath } from "./_lib/middleware/verifyToken";

const middleware = async (req: NextRequest) => {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const pathname = req.nextUrl.pathname;
  const { role } = (await TokenHelper(accessToken)) || {};

  // * 1. Public Path
  const publicRes = PublicPath({ pathname, role, req });
  if (publicRes) return publicRes;


  // * 2. Verify Token
  const verifyRes = await VerifyToken({
    accessToken,
    refreshToken,
    pathname,
    req,
  });
  if (verifyRes) return verifyRes;

  // * 3. Profile Path (role-based path check)
  const profileRes = await ProfilePath({ role, pathname, req });
  if (profileRes) return profileRes;

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: [
    `/(admin|creator|guest)/:path*`,
    `/category/:path*`,
    `/creators/:path*`,
  ],
};
