import { NextRequest, NextResponse } from "next/server";
import {
  PutCloudinary,
  PutImage,
} from "@/_lib/services/navbar/option/profile/action/services-btn";
// import { ItemFolderDescription } from "@/_lib/navbar/profile/route";
import GetToken from "@/_lib/middleware/get-token";
import {
  PostImageProductCloudinary,
  PostDb,
  GetPostDb,
} from "@/_lib/services/navbar/option/profile/services-post-image";
import { revalidateTag } from "next/cache";
import { GetUpdateImage } from "@/_lib/services/navbar/option/profile/action/services-btn";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ panel: string }> }
) {
  try {
    const { id } = await GetToken();
    const key = req.nextUrl.searchParams.get("key");
    const pathUrl = (await params).panel;

    const pathFolderName = req.nextUrl.searchParams.get("folder-name") ?? "";
    // const id = Number(req.nextUrl.searchParams.get("id"));

    switch (key) {
      case "description": {
        const result = await ItemFolderDescription(id);
        return NextResponse.json(result);
      }
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, name } = await GetToken();

    const method = req.nextUrl.searchParams.get("method");
    const typePost = req.nextUrl.searchParams.get("type");

    if (method === "post" && typePost === "photo") {
      const {
        idProduct,
        description,
        imageName,
        imagePath,
        hashtag,
        category,
        type,
        folderName,
        createdAt,
      } = await req.json();
      const webpName = imageName.replace(/\.[^/.]+$/, "") + ".webp";

      const cloudUrl = await PostImageProductCloudinary({
        webpName,
        imagePath,
        username: name,
      });

      await PostDb({
        idProduct,
        id,
        description,
        webpName,
        hashtag,
        category,
        type,
        folderName,
        cloudUrl,
        createdAt,
      });

      const result = await GetPostDb({
        idProduct,
      });

      revalidateTag(`list-folder-btn-${id}`, "max");
      // revalidateTag(`folders-photo-${id}`, "max");
      // revalidateTag(`item-folder-photo-${folderName}`, "max");

      return NextResponse.json({
        message: "New Post Success",
        data: result,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await GetToken();

    const method = req.nextUrl.searchParams.get("method");
    const typePut = req.nextUrl.searchParams.get("type");

    if (method === "put" && typePut === "photo") {
      const {
        idProduct,
        description,
        imageName,
        imagePath,
        prevImage,
        folderName,
        hashtag,
        category,
        type,
        updatedAt,
      } = await req.json();

      const webpName = imageName.replace(/\.[^/.]+$/, "") + ".webp";

      // Update ke database
      const url = await PutCloudinary({
        name,
        webpName,
        imagePath,
        prevImage,
      });

      await PutImage({
        idProduct,
        description,
        webpName,
        url,
        folderName,
        hashtag,
        category,
        updatedAt,
      });

      const result = await GetUpdateImage(id, idProduct);

      return NextResponse.json({
        message: "Update Success",
        data: result,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
