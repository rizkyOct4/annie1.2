import { prisma } from "@/_lib/db";
import sharp from "sharp";
import cloudinary from "@/_lib/cloudinary";
import camelcaseKeys from "camelcase-keys";
import { cacheLife, cacheTag } from "next/cache";
import type { TGetUpdateImage } from "../type";

// * GET LIST POST FOLDER =======
export const GetListPostFolder = async (id: string, type: string) => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`list-folder-btn-${id}`);

  const query = await prisma.$queryRaw<
    { folder_name: string }[]
  >`SELECT up.folder_name 
  FROM users_product up
  JOIN users u ON (u.id = up.ref_id)
  WHERE u.id = ${id}::uuid AND up.type = ${type}::type_product 
  GROUP BY up.folder_name`;

  if (query.length === 0) return [];

  return camelcaseKeys(query);
};

// * GET UPDATE IMAGE =======
export const GetUpdateImage = async (id: string, idProduct: number) => {
  const query = await prisma.$queryRaw<TGetUpdateImage[]>`
    SELECT upi.ref_id_product, upi.description, upi.image_name, upi.url, upi.hashtag, upi.category, COALESCE(SUM(upiv.like), 0)::int AS total_like, COALESCE(SUM(upiv.dislike), 0)::int AS total_dislike, up.folder_name, up.created_at
    FROM users_product_image upi
    JOIN users_product up ON (up.id_product = upi.ref_id_product)
    JOIN users u ON (u.id = up.ref_id)
    LEFT JOIN users_product_image_vote upiv ON (upiv.ref_id_product = up.id_product)
    WHERE upi.ref_id_product = ${idProduct} AND u.id = ${id}::uuid
    GROUP BY
      upi.description,
      upi.ref_id_product,
      upi.url,
      upi.image_name,
      upi.hashtag,
      upi.category,
      up.folder_name,
      up.created_at
    `;

  const dataRaw = query.map((i) => ({
    idProduct: i.ref_id_product,
    folderName: i.folder_name,
    description: i.description,
    imageName: i.image_name,
    url: i.url,
    hashtag: i.hashtag,
    total_like: i.total_like,
    total_dislike: i.total_dislike,
    category: i.category,
    createdAt: i.created_at,
  }));

  return camelcaseKeys(dataRaw);
};

// ? PUT IMAGE
export const PutCloudinary = async ({
  name,
  webpName,
  imagePath,
  prevImage,
}: {
  name: string;
  webpName: string;
  imagePath: string;
  prevImage: string;
}) => {
  if (!imagePath.startsWith("data:image")) {
    return prevImage;
  } else {
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
            folder: `users profile/${name}/products`,
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
  }
};

export const PutImage = ({
  idProduct,
  description,
  webpName,
  url,
  folderName,
  hashtag,
  category,
  updatedAt,
}: {
  idProduct: number;
  description: string;
  webpName: string;
  url: string;
  folderName: string;
  hashtag: string[];
  category: string[];
  updatedAt: Date;
}) => {
  return prisma.$transaction(async (tx) => {
    // ? users_product DB
    await tx.$queryRaw`
        UPDATE users_product
        SET folder_name = ${folderName}, created_at = ${updatedAt}::timestamp
        WHERE id_product = ${idProduct};
      `;

    await tx.$queryRaw`
        UPDATE users_product_image
        SET description = ${description}, image_name = ${webpName}, url = ${url}, hashtag = ${hashtag}::varchar[], category = ${category}::varchar[]
        WHERE ref_id_product = ${idProduct}
        `;
  });
};

// ? PUT FOLDER NAME
export const PutFolderName = ({
  targetFolder,
  value,
}: {
  targetFolder: string;
  value: string;
}) => {
  return prisma.$transaction(async (tx) => {
    // ? users_product -> folder_name DB
    await tx.$queryRaw`
        UPDATE users_product
        SET folder_name = ${value}
        WHERE folder_name = ${targetFolder}
      `;
  });
};

// ? PUT GROUPED FOLDER
export const PutGroupedFolderName = ({
  targetFolder,
  idProduct,
  prevFolder,
}: {
  targetFolder: string;
  idProduct: number[];
  prevFolder: string;
}) => {
  return prisma.$transaction(async (tx) => {
    // ? users_product -> folder_name DB
    await tx.$executeRaw`
        UPDATE users_product
        SET folder_name = ${targetFolder}
        WHERE folder_name = ${prevFolder}
        AND id_product = ANY(${idProduct})
      `;
  });
};

export const getResultPutGrouped = async ({
  prevFolder,
}: {
  prevFolder: string;
}) => {
  const query = await prisma.$queryRaw<{ prevFolder: number }[]>`
    SELECT COALESCE(COUNT(folder_name), 0) AS prevFolder
    FROM users_product
    WHERE folder_name = ${prevFolder}
  `;
  const dataRaw = [{ data: query[0].prevFolder }];
  return dataRaw;
};
