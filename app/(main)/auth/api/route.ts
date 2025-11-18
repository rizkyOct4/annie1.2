import { NextRequest, NextResponse } from "next/server";
import { Register, Login } from "@/_lib/navbar/auth/route";
import { jwtVerify, SignJWT } from "jose";
import { JWT_REFRESH_TOKEN, JWT_SECRET } from "@/_lib/config";

// ? REFRESH TOKEN
export async function GET(req: NextRequest) {
  const model = req.nextUrl.searchParams.get("model");
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (model === "refresh") {
    try {
      const { payload } = await jwtVerify(
        refreshToken!,
        new TextEncoder().encode(JWT_REFRESH_TOKEN)
      );

      // const now = Math.floor(Date.now() / 1000);
      // if (payload.exp && payload.exp < now) {
      //   console.log("Refresh token expired. User must login again.");
      //   return NextResponse.redirect(new URL(`/auth`, req.url));
      // }

      const newToken = await new SignJWT({
        publicId: payload.publicId,
        role: payload.role,
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" }) // * Header JWT
        .setExpirationTime("1h") // ! Expire 1 hari
        .sign(new TextEncoder().encode(JWT_SECRET));

      const redirectPath =
        req.cookies.get("redirect_after_login")?.value || "/";

      const res = NextResponse.redirect(new URL(redirectPath, req.url));

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
        return NextResponse.redirect(new URL(`/auth`, req.url));
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get("key");

    const body = await req.json();
    const { firstName, lastName, email, password, role } = body;

    if (key === "register") {
      await Register({ firstName, lastName, email, password, role });
      return NextResponse.json({
        message: "Register Success",
      });
    }

    if (key === "login") {
      const usersData = await Login({ email, password });
      const { token, refreshToken, ...userWithoutToken } = usersData;

      const redirectPath =
        req.cookies.get("redirect_after_login")?.value || "/";

      const redirectMiddleware = req.cookies.get("mid_redirect")?.value;

      // Buat response
      const res = NextResponse.json({
        message: "Login Success",
        data: userWithoutToken,
        cookiesRedirect: redirectPath,
        cookiesRedirectMiddleware: redirectMiddleware,
      });

      // Set cookie HttpOnly dengan token
      res.cookies.set({
        name: "access_token",
        value: token,
        httpOnly: true,
        maxAge: 60 * 60,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      // Set cookie HttpOnly dengan token
      res.cookies.set({
        name: "refresh_token",
        value: refreshToken,
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return res;
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
