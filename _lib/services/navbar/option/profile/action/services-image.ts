import { prisma } from "@/_lib/db";
import sharp from "sharp";
import cloudinary from "@/_lib/cloudinary";
import camelcaseKeys from "camelcase-keys";

// * POST CLOUD ===========================
export const PostImageProductCloudinary = async ({
  webpName,
  imagePath,
  id,
}: {
  webpName: string;
  imagePath: string;
  id: string;
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
          folder: `users/${id}/products/images`,
          public_id: webpName, // hapus ekstensi lama -> default public_id
          resource_type: "image",
          format: "webp",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(processedImage);
  });

  return result.secure_url;
};
// * POST DB ===========================
export const PostDb = async ({
  idProduct,
  id,
  description,
  webpName,
  hashtag,
  category,
  type,
  folderName,
  cloudUrl,
  createdAt,
}: {
  idProduct: number;
  id: string;
  description: string;
  webpName: string;
  hashtag: string[];
  category: string[];
  type: string;
  folderName: string;
  cloudUrl: string;
  createdAt: Date;
}) => {
  return prisma.$transaction(async (tx) => {
    // ? users_product DB

    const [user_product] = await tx.$queryRaw<any>`
      INSERT INTO users_product
        (ref_id, id_product, type, folder_name, status, created_at)
      VALUES (
        (SELECT id FROM users WHERE public_id = ${id}),
        ${idProduct},
        ${type}::type_product,
        ${folderName},
        true,
        ${createdAt}::timestamp
      )
      RETURNING id_product
    `;

    await tx.$executeRaw`
        INSERT INTO users_product_image 
        (ref_id_product, description, image_name, url, hashtag, category)
        VALUES (${user_product.id_product}, ${description}, ${webpName}, ${cloudUrl}, ${hashtag}::varchar[], ${category}::varchar[])`;
  });
};
// * RESULT POST DB ===========================
export const GetPostDb = async ({ idProduct }: { idProduct: number }) => {
  const result = await prisma.$queryRaw<
    { folder_name: string; ref_id_product: number; url: string }[]
  >`SELECT up.folder_name, up.created_at, up.id_product, upi.url
    FROM users_product_image upi
    JOIN users_product up ON (up.id_product = upi.ref_id_product)
    WHERE ref_id_product = ${idProduct}
    `;
  return camelcaseKeys(result);
};
