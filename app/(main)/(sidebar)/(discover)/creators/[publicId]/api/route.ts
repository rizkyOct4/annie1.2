import { NextRequest, NextResponse } from "next/server";
import {
  SCreatorsDescription,
  SListCreatorProduct,
  PostLikeImage,
} from "@/_lib/sidebar/discover/creators/route";
import { TokenHelper } from "@/_lib/tokenHelper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const publicIdCreator = (await params).publicId;
    const token = req.cookies.get("access_token")?.value;
    const { publicId } = (await TokenHelper(token)) || {};

    const section = Number(req.nextUrl.searchParams.get("section"));
    const limit = Number(req.nextUrl.searchParams.get("limit"));
    const offset = (section - 1) * limit;

    if (publicIdCreator && !section) {
      const resultdesc = await SCreatorsDescription(publicIdCreator);
      return NextResponse.json(resultdesc);
    }

    if (section && limit) {
      const result = await SListCreatorProduct(
        publicIdCreator,
        publicId,
        limit,
        offset
      );
      return NextResponse.json(result);
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const method = req.nextUrl.searchParams.get("action") ?? "";
    const token = req.cookies.get("access_token")?.value;
    const { publicId } = (await TokenHelper(token)) || {};

    if (method === "post") {
      const {
        iu_vote,
        tar_iu_receiver,
        tar_iu_product,
        like,
        status,
        created_at,
      } = await req.json();

      await PostLikeImage(
        publicId,
        iu_vote,
        tar_iu_receiver,
        tar_iu_product,
        like,
        status,
        created_at
      );

      return NextResponse.json({ success: true });
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
