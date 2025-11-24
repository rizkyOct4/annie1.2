import { NextRequest, NextResponse } from "next/server";
import { TokenHelper } from "@/_lib/tokenHelper";
import { ListFolderPhoto } from "@/_lib/services/navbar/profile/list-folder-service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    const { publicId } = (await TokenHelper(token)) || {};
    const pathUrl = (await params).type;

    const section = Number(req.nextUrl.searchParams.get("section"));
    const limit = Number(req.nextUrl.searchParams.get("limit"));
    const offset = (section - 1) * limit;

    if (pathUrl) {
      await ListFolderPhoto({ publicId, pathUrl, limit, offset });
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
