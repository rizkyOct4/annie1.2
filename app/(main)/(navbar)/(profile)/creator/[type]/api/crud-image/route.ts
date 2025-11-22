import { NextRequest, NextResponse } from "next/server";
import { PostCloudinary, PostDb, GetPostDb } from "@/_lib/navbar/profile/route";
import { PutCloudinary, PutImage } from "@/_lib/navbar/profile/crud/route";
import { ItemFolderDescription } from "@/_lib/navbar/profile/route";

export async function POST(req: NextRequest) {
  try {
    const method = req.nextUrl.searchParams.get("method");
    const typePost = req.nextUrl.searchParams.get("type");

    const body = await req.json();
    if (method === "post" && typePost === "photo") {
      const {
        iuProduct,
        publicId,
        description,
        imageName,
        imagePath,
        hashtags,
        categories,
        type,
        folderName,
        createdAt,
      } = body;
      const webpName = imageName.replace(/\.[^/.]+$/, "") + ".webp";

      const cloudUrl = await PostCloudinary({
        webpName,
        imagePath,
        publicId,
      });

      await PostDb({
        iuProduct,
        publicId,
        description,
        webpName,
        hashtags,
        categories,
        type,
        folderName,
        cloudUrl,
        createdAt,
      });

      const result = await GetPostDb({
        iuProduct,
      });

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
    const method = req.nextUrl.searchParams.get("method");
    const typePut = req.nextUrl.searchParams.get("type");

    if (method === "put" && typePut === "photo") {
      const {
        iuProduct,
        publicId,
        description,
        imageName,
        imagePath,
        prevImage,
        hashtags,
        categories,
        type,
        createdAt,
      } = await req.json();

      const webpName = imageName.replace(/\.[^/.]+$/, "") + ".webp";

      // Update ke database
      const url = await PutCloudinary({
        publicId,
        iuProduct,
        webpName,
        imagePath,
        prevImage,
      });

      await PutImage({
        iuProduct,
        description,
        imageName,
        url,
        hashtags,
        categories,
        createdAt,
      });

      const result = await ItemFolderDescription(iuProduct)

      return NextResponse.json({
        message: "Update Success",
        data: result,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
