// import { NextRequest, NextResponse } from "next/server";
// import { TotalCategory, TypeCategory } from "@/_lib/sidebar/discover/route";

// export async function GET(req: NextRequest) {
//   try {
//     const key = req.nextUrl.searchParams.get("searchQuery");
//     const category = decodeURIComponent(req.nextUrl.searchParams.get("category") ?? "");

//     if (key) {
//       const result = await TotalCategory();
//       return NextResponse.json(result);
//     }
//     if (category) {
//       const result = await TypeCategory(category);
//       return NextResponse.json(result);
//     }
//   } catch (err: any) {
//     return NextResponse.json({ message: err.message }, { status: 500 });
//   }
// }
