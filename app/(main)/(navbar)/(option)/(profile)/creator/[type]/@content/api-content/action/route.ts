import { NextRequest, NextResponse } from "next/server";
import {
  PutCloudinary,
  PutImage,
  PutFolderName,
  PutGroupedFolderName,
  getResultPutGrouped,
  DelGroupedPhoto,
  getResultDelGrouped,
} from "@/_lib/services/navbar/option/profile/action/services-btn";
import GetToken from "@/_lib/middleware/get-token";
import {
  PostImageProductCloudinary,
  PostDb,
  GetPostDb,
} from "@/_lib/services/navbar/option/profile/action/services-image";
import { revalidateTag } from "next/cache";
import { GetUpdateImage } from "@/_lib/services/navbar/option/profile/action/services-btn";
import {
  PostDbVideo,
  OutputVideo,
} from "@/_lib/services/navbar/option/profile/action/services-video";

export async function POST(req: NextRequest) {
  try {
    const { id } = await GetToken();

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
        id,
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

      return NextResponse.json({
        message: "New Post Success",
        data: result,
      });
    }
    if (method === "postVideo" && typePost === "video") {
      // const formData = await req.formData();
      // const rawCategory = formData.get("category") as string;
      // const rawHashtag = formData.get("hashtag") as string;
      // const createdAtRaw = formData.get("createdAt") as string;

      // const idProduct = Number(formData.get("idProduct"));
      // const folderName = formData.get("folderName") as string;
      // const description = formData.get("description") as string;
      // const hashtag = rawHashtag.split(",");
      // const category = rawCategory.split(",");
      // const file = formData.get("file") as File;
      // const createdAt = new Date(createdAtRaw);

      // const videoName = `video-${idProduct}-${id}`;

      // const { publicId, url, thumbnail, duration, width, height, format } =
      //   await PostVideoProductCloudinary({
      //     file: file,
      //     videoName: videoName,
      //     id: id,
      //   });
      const {
        folderName,
        description,
        url,
        publicId,
        thumbnailUrl,
        duration,
        hashtag,
        category,
        idProduct,
        format,
        height,
        width,
        createdAt,
      } = await req.json();

      await PostDbVideo({
        id,
        type: typePost,
        folderName,
        description,
        url,
        thumbnailUrl,
        duration,
        hashtag,
        category,
        idProduct,
        publicId,
        format,
        height,
        width,
        createdAt,
      });

      // const output = await OutputVideo({ id: id, idProduct: idProduct });

      return NextResponse.json({
        message: "New Post Success",
        // data: output,
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
    if (key === "groupedPutImage" && typePut === "photo") {
      const { targetFolder, prevFolder, idProduct } = await req.json();

      await PutGroupedFolderName({
        targetFolder: targetFolder,
        idProduct: idProduct,
        prevFolder: prevFolder,
      });

      const result = await getResultPutGrouped({ prevFolder: prevFolder });

      revalidateTag(`list-folder-btn-${id}`, "max");

      return NextResponse.json({
        message: "Update Success",
        data: result,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await GetToken();

    const key = req.nextUrl.searchParams.get("key");
    const type = req.nextUrl.searchParams.get("type");

    switch (key) {
      case "groupedDeleteImage": {
        const { prevFolder, idProduct } = await req.json();
        await DelGroupedPhoto({ id, idProduct, prevFolder });

        const output = await getResultDelGrouped({ prevFolder });

        return NextResponse.json({
          message: "Delete Success",
          data: output,
        });
      }
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
