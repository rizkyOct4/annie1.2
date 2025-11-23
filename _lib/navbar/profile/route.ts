import { prisma } from "@/_lib/db";
import sharp from "sharp";
import cloudinary from "@/_lib/cloudinary";
import type {
  ListFolderType,
  ItemFolderType,
  ItemFolderDescriptionType,
  ResultGetPostDB,
} from "./type";

// ? LIST FOLDER
export const ListFolder = async (
  path: string,
  publicId: string | undefined,
  limit: number,
  offset: number
) => {
  try {
    const queryList = await prisma.$queryRaw<
      ListFolderType[]
    >`SELECT up.folder_name, COALESCE(COUNT(up.folder_name), 0)::int AS total_product
    FROM users_product up
    JOIN users u ON (u.iu = up.tar_iu)
    WHERE u.public_id = ${publicId}::uuid AND up.type = ${path}::type_product
    GROUP BY
    up.folder_name
    LIMIT ${limit}
    OFFSET ${offset}
    `;
    if (!queryList) return [];

    // ? Menghitung jumlah folder unik yang ada di dalam users_product untuk public_id tertentu. Ini akan mengembalikan jumlah folder yang berbeda (tanpa duplikasi).
    const queryTotal = await prisma.$queryRaw<any>`
      SELECT COUNT(DISTINCT up.folder_name) AS amount_folder ,COUNT(up.folder_name) AS count
      FROM users_product up
      JOIN users u ON (u.iu = up.tar_iu)
      WHERE u.public_id = ${publicId}::uuid
      `;

    const hasMore = offset + limit < Number(queryTotal[0].amount_folder);

    const data = queryList.map((i) => ({
      folderName: i.folder_name,
      totalProduct: i.total_product,
    }));

    return { data, hasMore };
  } catch (err: any) {
    throw new Error(err.message);
  }
};
// ? ITEM FOLDER
export const ItemFolder = async (
  typeParams: string,
  publicId: string | undefined,
  folderName: string,
  limit: number,
  offset: number
) => {
  // const result = {
  //   folderName: folderName,
  //   data: [] as any[],
  //   hasMore: false
  // }

  const query = await prisma.$queryRaw<
    ItemFolderType[]
  >`SELECT upi.tar_iu_product, upi.url
    FROM users_product_image upi
    JOIN users_product up ON (up.iu_product = upi.tar_iu_product)
    WHERE up.folder_name = ${folderName} AND up.type = ${typeParams}::type_product
    LIMIT ${limit}
    OFFSET ${offset}
    `;

  if (!query) return [];

  const queryCheck = await prisma.$queryRaw<any>`
      SELECT COUNT(folder_name) AS amount
      FROM users_product
      WHERE folder_name = ${folderName}`;

  const hasMore = offset + limit < Number(queryCheck[0].amount);

  const data = query.map((i) => ({
    tarIuProduct: i.tar_iu_product,
    url: i.url,
  }));

  return {data, hasMore};
};
// ? ITEM DESCRIPTION
export const ItemFolderDescription = async (
  id: number
) => {
  const query = await prisma.$queryRaw<
    ItemFolderDescriptionType[]
  >`SELECT upi.tar_iu_product, upi.description,upi.url, upi.hashtag, upi.category, COALESCE(SUM(upiv.like), 0)::int AS total_like, COALESCE(SUM(upiv.dislike), 0)::int AS total_dislike, up.created_at
    FROM users_product_image upi
    JOIN users_product up ON (up.iu_product = upi.tar_iu_product)
    LEFT JOIN users_product_image_vote upiv ON (upiv.tar_iu_product = up.iu_product)
    WHERE upi.tar_iu_product = ${id}
    GROUP BY
    upi.description,
    upi.tar_iu_product,
    upi.url,
    upi.hashtag,
    upi.category,
    up.created_at
    `;

  if (!query) return [];

  return query.map((i) => ({
    tarIuProduct: i.tar_iu_product,
    description: i.description,
    url: i.url,
    hashtag: i.hashtag,
    category: i.category,
    totalLike: i.total_like,
    totalDislike: i.total_dislike,
    createdAt: i.created_at,
  }));
};

// * POST CLOUD ===========================
export const PostCloudinary = async ({
  webpName,
  imagePath,
  publicId,
}: {
  webpName: string;
  imagePath: string;
  publicId: string;
}) => {
  // ? Check Cloudinary
  // --- 1. Decode base64 jadi buffer ---
  const [header, base64Data] = imagePath.split(",", 2);
  const imageBuffer = Buffer.from(base64Data, "base64");

  // --- 2. Resize + convert ke WEBP pakai sharp ---
  const processedImage = await sharp(imageBuffer)
    .resize(800, 800, { fit: "inside" }) // max 800x800
    .webp({ quality: 85 }) // convert ke WEBP
    .toBuffer();

  // --- 3. Upload ke Cloudinary ---
  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `usersProduct/${publicId}/`,
          public_id: webpName, // hapus ekstensi lama
          resource_type: "image",
          format: "webp",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(processedImage); // isi stream dengan buffer hasil sharp
  });

  return result.secure_url;
};
// * POST DB ===========================
export const PostDb = async ({
  iuProduct,
  publicId,
  description,
  webpName,
  hashtag,
  category,
  type,
  folderName,
  cloudUrl,
  createdAt,
}: {
  iuProduct: number;
  publicId: string;
  description: string;
  webpName: string;
  hashtag: string[];
  category: string[];
  type: string;
  folderName: string;
  cloudUrl: string;
  createdAt: Date;
}) => {
  try {
    return prisma.$transaction(async (tx) => {
      const [query] = await tx.$queryRaw<
        { iu: number }[]
      >`SELECT iu FROM users WHERE public_id = ${publicId}::uuid`;
      const iu = query.iu;

      await tx.$executeRaw`
        INSERT INTO users_product 
        (tar_iu, iu_product, type, folder_name, status, created_at)
        VALUES (${iu}, ${iuProduct}, ${type}::type_product, ${folderName}, ${true}, ${createdAt}::timestamp)`;

      await tx.$executeRaw`
        INSERT INTO users_product_image 
        (tar_iu_product, description, image_name, url, hashtag, category)
        VALUES (${iuProduct}, ${description}, ${webpName}, ${cloudUrl}, ${hashtag}::varchar[], ${category}::varchar[])`;
    });
  } catch (err: any) {
    throw new Error(err);
  }
};
// * RESULT POST DB ===========================
export const GetPostDb = async ({ iuProduct }: { iuProduct: number }) => {
  const result = await prisma.$queryRaw<
    ResultGetPostDB[]
  >`SELECT tar_iu_product, url
    FROM users_product_image WHERE tar_iu_product = ${iuProduct}
    `;

  if (result.length === 0) return [];

  return result.map((i) => ({
    tarIuProduct: i.tar_iu_product,
    url: i.url,
  }));
};
