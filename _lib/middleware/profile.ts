import { NextResponse, NextRequest } from "next/server";

const ProfilePath = async ({
  role,
  pathname,
  req,
}: {
  role: string | undefined;
  pathname: string;
  req: NextRequest;
}) => {
  try {
    // ? ROLE USERS
    const rolePaths: Record<string, string> = {
      admin: `/admin`,
      creator: `/creator`,
      guest: `/guest`,
    };

    // ? ROLE SPESIFIC
    if (!pathname.startsWith(rolePaths[role])) {
      return NextResponse.redirect(new URL(`/not-found`, req.url));
    }

    return NextResponse.next();
  } catch (err: any) {
    console.error(err)
    return NextResponse.redirect(new URL(`/auth`, req.url));
  }
};

export default ProfilePath;
