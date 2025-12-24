import { NextRequest, NextResponse } from "next/server";
import {
  PutCloudinary,
  PutImage,
  PutFolderName,
  PutGroupedFolderName,
  getResultPutGrouped,
} from "@/_lib/services/navbar/option/profile/action/services-btn";
import GetToken from "@/_lib/middleware/get-token";
import {
  PostImageProductCloudinary,
  PostDb,
  GetPostDb,
} from "@/_lib/services/navbar/option/profile/services-post-image";
import { revalidateTag } from "next/cache";
import { GetUpdateImage } from "@/_lib/services/navbar/option/profile/action/services-btn";

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

    const key = req.nextUrl.searchParams.get("key");
    const changeNameFolder = req.nextUrl.searchParams.get("change-folder");

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
    if (key === "putNameFolder" && changeNameFolder) {
      const { targetFolder, value } = await req.json();

      const result = await PutFolderName({
        targetFolder: targetFolder,
        value: value,
      });
      return NextResponse.json({
        message: "Update Success",
        data: result,
      });
    }
    if (key === "groupedPutImage" && changeNameFolder) {
      const { targetFolder, prevFolder, idProduct } = await req.json();

      await PutGroupedFolderName({
        targetFolder: targetFolder,
        idProduct: idProduct,
        prevFolder: prevFolder,
      });

      const result = getResultPutGrouped({ prevFolder: prevFolder });

      return NextResponse.json({
        message: "Update Success",
        data: result,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
