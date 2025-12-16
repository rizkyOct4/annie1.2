import { NextRequest, NextResponse } from "next/server";
import GetToken from "@/_lib/middleware/get-token";
import { GetCustomize } from "@/_lib/services/navbar/option/customize";
import {
  PostCloudinary,
  PostCustomize,
  PostReturn,
} from "@/_lib/services/navbar/option/customize";

export async function GET(req: NextRequest) {
  try {
    const { id } = await GetToken();
    const result = await GetCustomize({ publicId: id });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id } = await GetToken();

    const {
      biodata,
      currentPicture,
      gender,
      location,
      phoneNumber,
      picture,
      username,
      socialLink,
    } = await req.json();

    const pictureWebp = currentPicture.replace(".jpg", ".webp");

    const urlCloud = await PostCloudinary({
      pictureWebp: pictureWebp,
      pictureBase: picture,
      publicId: id,
    });

    await PostCustomize({
      publicId: id,
      biodata,
      gender,
      location,
      phoneNumber,
      username,
      socialLink,
      urlCloud,
    });

    const returnDb = await PostReturn({ publicId: id });

    return NextResponse.json({ success: true, returnDb });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
