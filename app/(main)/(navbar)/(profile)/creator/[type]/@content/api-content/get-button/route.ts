import { NextRequest, NextResponse } from "next/server";
import { TokenHelper } from "@/_lib/tokenHelper";
import {
  GetListPostFolder,
  GetUpdateImage,
} from "@/_lib/navbar/profile/crud/route";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    const { publicId } = (await TokenHelper(token)) || {};
    const typeBtn = req.nextUrl.searchParams.get("type-btn");
    const iuProduct = Number(req.nextUrl.searchParams.get("iu-product"));

    // * List Folder Form
    if (typeBtn) {
      const result = await GetListPostFolder(publicId, typeBtn);
      return NextResponse.json(result);
    }

    if (iuProduct) {
      const result = await GetUpdateImage(iuProduct);
      return NextResponse.json(result);
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
