import { NextResponse, NextRequest } from "next/server";
import { JWT_SECRET, JWT_REFRESH_TOKEN } from "../config";
import { jwtVerify, SignJWT } from "jose";

const VerifyToken = async ({
  accessToken,
  refreshToken,
  pathname,
  req,
}: {
  accessToken?: string;
  refreshToken?: string;
  pathname: string;
  req: NextRequest;
}) => {
  if (!accessToken) {
    const res = NextResponse.redirect(new URL(`/auth`, req.url));
    res.cookies.set("redirect_after_login", pathname, {
      path: "/",
      httpOnly: true,
    });
    return res;
  }

  try {
    const { payload } = await jwtVerify(
      accessToken!,
      new TextEncoder().encode(JWT_SECRET)
    );

    if (payload) return NextResponse.next();
  } catch (error: any) {
    if (error?.code === "ERR_JWT_EXPIRED") {
      console.log("Access token expired. Trying refresh...");

      // * REFRESH ACCESS TOKEN
      try {
        const res = NextResponse.next();
        const { payload } = await jwtVerify(
          refreshToken!,
          new TextEncoder().encode(JWT_REFRESH_TOKEN)
        );

        const newToken = await new SignJWT({
          publicId: payload.publicId,
          role: payload.role,
        })
          .setProtectedHeader({ alg: "HS256", typ: "JWT" }) // * Header JWT
          .setExpirationTime("1h") // ! Expire 1 hari
          .sign(new TextEncoder().encode(JWT_SECRET));

        res.cookies.set({
          name: "access_token",
          value: newToken,
          httpOnly: true,
          maxAge: 60 * 60 * 24,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        return res;
      } catch (err: any) {
        if (err?.code === "ERR_JWT_EXPIRED") {
          console.log("Refresh token expired.");

          const res = NextResponse.redirect(new URL(`/auth`, req.url));
          res.cookies.set("redirect_after_login", pathname, {
            path: "/",
            httpOnly: true,
          });

          return res;
        }
      }
    }
  }
};

const PublicPath = ({
  pathname,
  role,
  req,
}: {
  pathname: string;
  role: string | undefined;
  req: NextRequest;
}) => {
  // * Public Path ===========
  const publicPaths = [`/auth`, `/category`, `/creators`, "/_next/"];

  if (
    publicPaths.some((path) => pathname.startsWith(path)) &&
    req.method === "GET"
  ) {
    return NextResponse.next();
  }

  if ((role === "guest" || !role) && req.method !== "GET") {
    const res = NextResponse.json(
      { message: "Middleware Unauthorized" },
      { status: 401 }
    );

    res.cookies.set({
      name: "mid_redirect",
      value: pathname.replace("/api", ""),
      path: "/",
      httpOnly: true,
    });

    return res;
  }
};

export { VerifyToken, PublicPath };
