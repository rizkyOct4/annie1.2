import { NextRequest, NextResponse } from "next/server";
import { Register, Login } from "@/_lib/navbar/auth/route";

export async function POST(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get("key");

    const body = await req.json();
    const { firstName, lastName, email, password, role } = body;

    switch (key) {
      case "register": {
        await Register({ firstName, lastName, email, password, role });
        return NextResponse.json({
          message: "Register Success",
        });
      }
      case "login": {
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
      case "logout": {
        // Hapus cookie dengan meng-set value kosong dan expiry di masa lalu
        const res = NextResponse.json({ message: "Logged out" });

        res.cookies.set({
          name: "access_token",
          value: "",
          path: "/",
          expires: new Date(0), // masa lalu
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        res.cookies.set({
          name: "refresh_token",
          value: "",
          path: "/",
          expires: new Date(0),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return res;
      }
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}


// todo PERBAIKI SAMA KAU MIDDLEWARE !! DARI PATH /NOTIFICATION LOGIN BERMASALAH !! FIXKAN BESOK !!
// EDM Relax #4】Chill & Focus Lo-Fi EDM 🎧 Background Music for Study, Work & Everyday Moments