import { NextRequest, NextResponse } from "next/server";
import { ListPostFolder } from "@/_lib/navbar/profile/route";
import { TokenHelper } from "@/_lib/tokenHelper";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    const { publicId } = (await TokenHelper(token)) || {};
    const typeQuery = req.nextUrl.searchParams.get("typeBtn");

    // * List Folder Form
    if (typeQuery) {
      const result = await ListPostFolder(publicId, typeQuery);
      return NextResponse.json(result);
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
