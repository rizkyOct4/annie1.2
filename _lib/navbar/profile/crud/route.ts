import { prisma } from "@/_lib/db";
import sharp from "sharp";
import cloudinary from "@/_lib/cloudinary";
import type { GetUpdateImageType } from "../type";

// * GET LIST POST FOLDER =======
export const GetListPostFolder = async (
  publicId: string | undefined,
  type: string | null
) => {
  const get = await prisma.$queryRaw<
    { folder_name: string }[]
  >`SELECT up.folder_name 
  FROM users_product up
  JOIN users u ON (u.iu = up.tar_iu)
  WHERE u.public_id = ${publicId}::uuid AND up.type = ${type}::type_product 
  GROUP BY up.folder_name`;

  if (get.length === 0) return [];

  return get.map((i) => ({
    folderName: i.folder_name,
  }));
};

// * GET UPDATE IMAGE =======
export const GetUpdateImage = async (iuProduct: number) => {
  const query = await prisma.$queryRaw<GetUpdateImageType[]>`
        SELECT up.iu_product, up.folder_name, up.created_at, upi.description, upi.image_name, upi.url, upi.hashtag, upi.category
        FROM users_product up
        JOIN users_product_image upi ON (up.iu_product = upi.tar_iu_product)
        WHERE up.iu_product = ${iuProduct}
    `;

  if (!query) return [];

  return query.map((i) => ({
    iuProduct: i.iu_product,
    folderName: i.folder_name,
    createdAt: i.created_at,
    description: i.description,
    imageName: i.image_name,
    url: i.url,
    hashtag: i.hashtag,
    category: i.category,
  }));
};

// ? PUT IMAGE
export const PutCloudinary = async ({
  publicId,
  iuProduct,
  webpName,
  imagePath,
  prevImage,
}: {
  publicId: string;
  iuProduct: number;
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
  }
};

export const PutImage = ({
  iuProduct,
  description,
  webpName,
  url,
  hashtag,
  category,
  createdAt,
}: {
  iuProduct: number;
  description: string;
  webpName: string;
  url: string;
  hashtag: string[];
  category: string[];
  createdAt: Date;
}) => {
  try {
    return prisma.$transaction(async (tx) => {
      // ? users_product DB
      await tx.$queryRaw`
        UPDATE users_product
        SET created_at = ${createdAt}::timestamp
        WHERE iu_product = ${iuProduct};
      `;

      await tx.$queryRaw`
        UPDATE users_product_image
        SET description = ${description}, image_name = ${webpName}, url = ${url}, hashtag = ${hashtag}::varchar[], category = ${category}::varchar[]
        WHERE tar_iu_product = ${iuProduct}
        `;
    });
  } catch (err: any) {
    throw new Error(err);
  }
};
