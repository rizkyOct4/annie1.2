import { NextRequest, NextResponse } from "next/server";
import {
  ListFolder,
  ItemFolder,
  ItemFolderDescription,
} from "@/_lib/navbar/profile/route";
import { TokenHelper } from "@/_lib/tokenHelper";

// export async function GET(
//   req: NextRequest,
//   {
//     params,
//   }: {
//     params: Promise<{ slug: string }>;
//   }
// ) {
//   try {
//     const token = req.cookies.get("access_token")?.value;
//     const { publicId } = (await TokenHelper(token)) || {};

//     const path = (await params)?.slug;
//     const searchQuery = req.nextUrl.searchParams.get("folder-name") ?? "";
//     console.log(searchQuery);
//     // const [folderName, id] = (
//     //   req.nextUrl.searchParams.get("folder-name") ?? ""
//     // )?.split("/");
//     // console.log('id2222: ',id);
//     // const [folderName, id] = searchQuery.split("/").filter(Boolean); // ? filter untuk menghapus "" / dll !!
//     // const newPath = Number(id);
//     // console.log('folder NEXT', folderName)
//     // console.log('id NEXT', id)

//     if (path && !searchQuery) {
//       const listData = await ListFolder(path, publicId);
//       return NextResponse.json({
//         message: "ok",
//         listFolder: listData,
//       });
//     }
//     if (searchQuery) {
//       const itemData = await ItemFolder(path, publicId, searchQuery);
//       return NextResponse.json({
//         message: "ok",
//         itemFolder: itemData,
//       });
//     }
//   } catch (err: any) {
//     return NextResponse.json({ message: err.message }, { status: 500 });
//   }
// }

// export async function GET(
//   req: NextRequest,
//   {
//     params,
//   }: {
//     params: Promise<{ id: string }>;
//   }
// ) {
//   try {
//     const token = req.cookies.get("access_token")?.value;
//     const { publicId } = (await TokenHelper(token)) || {};

//     const path = Number((await params)?.id);
//     if (path) {
//       const result = await ItemFolderDescription(publicId, path);
//       return NextResponse.json(result);
//     }
//   } catch (err: any) {
//     return NextResponse.json({ message: err.message }, { status: 500 });
//   }
// }

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    const { publicId } = (await TokenHelper(token)) || {};
    const typeParams = (await params).type;

    const folderName = req.nextUrl.searchParams.get("folderName");
    const id = Number(req.nextUrl.searchParams.get("id"));

    const section = Number(req.nextUrl.searchParams.get("section"));
    const limit = Number(req.nextUrl.searchParams.get("limit"));
    const offset = (section - 1) * limit;

    // ? List Folder Photo
    if (typeParams && !folderName && !id) {
      const listData = await ListFolder(typeParams, publicId, limit, offset);
      return NextResponse.json(listData);
    }
    if (folderName && !id) {
      const itemData = await ItemFolder(
        typeParams,
        publicId,
        folderName,
        limit,
        offset
      );
      return NextResponse.json(itemData);
    }
    if (id) {
      const result = await ItemFolderDescription(publicId, id);
      return NextResponse.json(result);
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const method = req.nextUrl.searchParams.get("method");
//     const typePost = req.nextUrl.searchParams.get("type");

//     const body = await req.json();
//     if (method === "post" && typePost === "photo") {
//       const {
//         iuProduct,
//         publicId,
//         description,
//         imageName,
//         imagePath,
//         hashtags,
//         categories,
//         type,
//         folderName,
//         createdAt,
//       } = body;
//       const webpName = imageName.replace(/\.[^/.]+$/, "") + ".webp";

//       const cloudUrl = await PostCloudinary({
//         webpName,
//         imagePath,
//         publicId,
//       });

//       await PostDb({
//         iuProduct,
//         publicId,
//         description,
//         webpName,
//         hashtags,
//         categories,
//         type,
//         folderName,
//         cloudUrl,
//         createdAt,
//       });

//       const result = await GetPostDb({
//         iuProduct,
//       });

//       return NextResponse.json({
//         message: "New Post Success",
//         data: result,
//       });
//     }
//   } catch (err: any) {
//     return NextResponse.json({ message: err.message }, { status: 500 });
//   }
// }
