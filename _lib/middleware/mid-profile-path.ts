import { NextResponse, NextRequest } from "next/server";

const ProfilePath = async ({
  role,
  pathname,
  req,
}: {
  role: string;
  pathname: string;
  req: NextRequest;
}) => {
  // ? ROLE USERS
  const rolePaths: Record<string, string> = {
    admin: `/admin`,
    creator: `/creator`,
  };

  // console.log('test')
  // ? ROLE SPESIFIC
  if (!pathname.startsWith(rolePaths[role])) {
    return NextResponse.redirect(
      new URL(`/auth?redirect=${encodeURIComponent(pathname)}`, req.url)
    );
  }
};

export default ProfilePath;
