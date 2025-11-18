import {
  TypeCategory,
  TypeCategoryDescription,
} from "@/_lib/sidebar/discover/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ type: string }>;
  }
) {
  try {
    const path = (await params).type;
    const searchQuery = Number(req.nextUrl.searchParams.get("id"));

    if (path && !searchQuery) {
      const result = await TypeCategory(path);
      return NextResponse.json(result);
    }

    if (searchQuery) {
      const result = await TypeCategoryDescription(searchQuery);
      return NextResponse.json(result);
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
