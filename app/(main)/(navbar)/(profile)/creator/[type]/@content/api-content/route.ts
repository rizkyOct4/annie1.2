import { NextRequest, NextResponse } from "next/server";
import {
  ListFolder,
  ItemFolder,
  ItemFolderDescription,
} from "@/_lib/navbar/profile/route";
import { TokenHelper } from "@/_lib/tokenHelper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    const { publicId } = (await TokenHelper(token)) || {};
    const typeParams = (await params).type;

    const folderName = req.nextUrl.searchParams.get("folderName");
    const id = Number(req.nextUrl.searchParams.get("id"));

    const section = Number(req.nextUrl.searchParams.get("section"));
    const limit = Number(req.nextUrl.searchParams.get("limit"));
    const offset = (section - 1) * limit;

    // ? List Folder Photo
    if (typeParams && !folderName && !id) {
      const listData = await ListFolder(typeParams, publicId, limit, offset);
      return NextResponse.json(listData);
    }
    if (folderName && !id) {
      const itemData = await ItemFolder(
        typeParams,
        publicId,
        folderName,
        limit,
        offset
      );
      return NextResponse.json(itemData);
    }
    if (id) {
      const result = await ItemFolderDescription(id);
      return NextResponse.json(result);
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}