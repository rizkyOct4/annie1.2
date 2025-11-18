import { NextRequest, NextResponse } from "next/server";
import { SCreators } from "@/_lib/sidebar/discover/creators/route";
import { TokenHelper } from "@/_lib/tokenHelper";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    const { publicId } = (await TokenHelper(token)) || {};

    const sectionPage = Number(req.nextUrl.searchParams.get("section"));
    const limit = Number(req.nextUrl.searchParams.get("limit"));
    const offset = (sectionPage - 1) * limit;

    const result = await SCreators(publicId, limit, offset);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
