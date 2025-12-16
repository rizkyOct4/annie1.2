import { NextResponse, NextRequest } from "next/server";

const PublicPath = ({
  pathname,
  role,
  req,
}: {
  pathname: string;
  role: string;
  req: NextRequest;
}) => {
  // * Public Path ===========
  const publicPaths = [
    `/auth`,
    `/category`,
    `/notification`,
    // `/customize`,
    `/creators`,
    "/_next/",
  ];

  if (
    publicPaths.some((path) => pathname.startsWith(path)) &&
    req.method === "GET"
  ) {
    return NextResponse.next();
  }

  if (!role && req.method !== "GET") {
    return NextResponse.redirect(new URL(`/auth`, req.url));
  } else {
    return NextResponse.next();
  }
};

export { PublicPath };
