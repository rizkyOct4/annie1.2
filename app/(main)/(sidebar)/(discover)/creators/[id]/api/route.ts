import { NextRequest, NextResponse } from "next/server";
import {
  GetTargetCreatorsDescription,
  GetListCreatorsProduct,
  GetListCreatorsVideo,
  PostLikeImage,
  PostFollowUsers,
} from "@/_lib/services/sidebar/discover/creators/services-creators";
import GetToken from "@/_lib/middleware/get-token";
import { revalidateTag } from "next/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const idTarget = (await params).id;
    const { id: idSender } = await GetToken();

    const key = req.nextUrl.searchParams.get("key");
    const section = Number(req.nextUrl.searchParams.get("section"));
    const limit = Number(req.nextUrl.searchParams.get("limit"));
    const offset = (section - 1) * limit;

    if (idTarget && !section) {
      const resultdesc = await GetTargetCreatorsDescription({
        idTargetCreator: idTarget,
        idSender: idSender,
      });
      return NextResponse.json(resultdesc);
    }

    switch (key) {
      case "photo": {
        const result = await GetListCreatorsProduct({
          idTarget: idTarget,
          idSender: idSender,
          limit: limit,
          offset: offset,
        });
        return NextResponse.json(result);
      }
      case "video": {
        const result = await GetListCreatorsVideo({
          idTarget: idTarget,
          idSender: idSender,
          type: key,
          limit: limit,
          offset: offset,
        });
        return NextResponse.json(result);
      }
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get("key");

    const { id } = await GetToken();

    switch (key) {
      case "like": {
        const { refIdProduct, status, createdAt } = await req.json();

        await PostLikeImage(id, refIdProduct, status, createdAt);
        return NextResponse.json({ success: true });
      }
      case "follow": {
        const { idReceiver, status } = await req.json();
        await PostFollowUsers({
          idSender: id,
          idReceiver: idReceiver,
          status: status,
        });

        revalidateTag(`target-creators-description-${idReceiver}`, "max");
        return NextResponse.json({ success: true });
      }
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
