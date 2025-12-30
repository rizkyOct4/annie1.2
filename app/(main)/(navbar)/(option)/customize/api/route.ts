import { NextRequest, NextResponse } from "next/server";
import GetToken from "@/_lib/middleware/get-token";
import { GetCustomize } from "@/_lib/services/navbar/option/customize";
import {
  PostCloudinary,
  PostCustomize,
  PostReturn,
} from "@/_lib/services/navbar/option/customize";
import { revalidateTag } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const { id } = await GetToken();
    const result = await GetCustomize({ id });
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
      pictureWebp,
      picture,
      id,
    });

    await PostCustomize({
      id,
      biodata,
      gender,
      location,
      phoneNumber,
      username,
      socialLink,
      urlCloud,
    });

    const returnDb = await PostReturn({ id });

    revalidateTag("customize-profile", "max");
    return NextResponse.json({ success: true, returnDb });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
