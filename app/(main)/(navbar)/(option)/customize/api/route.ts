import { NextRequest, NextResponse } from "next/server";
import GetToken from "@/_lib/middleware/get-token";
import { GetCustomize } from "@/_lib/services/navbar/option/customize";

export async function GET(req: NextRequest) {
  try {
    const { id } = await GetToken();
    const result = await GetCustomize({ publicId: id });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

//  Remove-Item -Force .\pnpm-lock.yaml
// pnpm install -> pnpm dev