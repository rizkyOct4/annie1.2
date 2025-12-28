import { prisma } from "@/_lib/db";
import cloudinary from "@/_lib/cloudinary";
import camelcaseKeys from "camelcase-keys";

// * POST VIDEO CLOUD ===========================
// export const PostVideoProductCloudinary = async ({
//   file,
//   id,
// }: {
//   file: File;
//   id: string;
// }) => {
//   // 1. Convert File -> Buffer
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   // 2. Upload ke Cloudinary (VIDEO)
//   const result = await new Promise<any>((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           folder: `users profile/${id}/videos`,
//           public_id: id,
//           resource_type: "video",
//           overwrite: true,
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       )
//       .end(buffer);
//   });

//   const thumbnailUrl = cloudinary.url(result.public_id, {
//     resource_type: "video",
//     format: "jpg",
//     transformation: [
//       { width: 800, crop: "scale" },
//       { start_offset: "auto" }, // ambil frame terbaik
//     ],
//   });

//   return {
//     publicId: result.public_id,
//     url: result.secure_url,
//     thumbnail: thumbnailUrl,
//     duration: result.duration,
//     width: result.width,
//     height: result.height,
//     format: result.format,
//   };
// };

// export const PostVideoProductCloudinary = async ({
//   file,
//   videoName,
//   id,
// }: {
//   file: File;
//   videoName: string;
//   id: string;
// }) => {
//   // 1. Convert File -> Buffer
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   // 2. Upload ke Cloudinary (VIDEO)
//   const result = await new Promise<any>((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           folder: `users profile/${id}/videos`,
//           public_id: videoName,
//           resource_type: "video",
//           overwrite: true,
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       )
//       .end(buffer);
//   });

//   const thumbnailUrl = cloudinary.url(result.public_id, {
//     resource_type: "video",
//     format: "jpg",
//     transformation: [
//       { width: 800, crop: "scale" },
//       { start_offset: "auto" }, // ambil frame terbaik
//     ],
//   });

//   return {
//     publicId: result.public_id,
//     url: result.secure_url,
//     thumbnail: thumbnailUrl,
//     duration: result.duration,
//     width: result.width,
//     height: result.height,
//     format: result.format,
//   };
// };

export const PostDbVideo = async ({
  id,
  type,
  folderName,
  description,
  url,
  thumbnailUrl,
  duration,
  hashtag,
  category,
  idProduct,
  publicId,
  format,
  height,
  width,
  createdAt,
}: {
  id: string;
  type: string;
  folderName: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  hashtag: string[];
  category: string[];
  idProduct: number;
  publicId: string;
  format: string;
  height: number;
  width: number;
  createdAt: Date;
}) => {
  return prisma.$transaction(async (tx) => {
    // ? users_product_video DB

    await tx.$executeRaw`
        INSERT INTO users_product (ref_id, type, folder_name, status, created_at, id_product)
        VALUES((SELECT id FROM users WHERE public_id = ${id}),
        ${type}::type_product, ${folderName}, ${true}, ${createdAt}::timestamp, ${idProduct})`;

    await tx.$executeRaw`
        INSERT INTO users_product_video (description, url, thumbnail_url, duration, hashtag, category, ref_id_product, cloud_public_id, format, height, width)
        VALUES (${description}, ${url}, ${thumbnailUrl}, ${duration}, ${hashtag}::varchar[], ${category}::varchar[], ${idProduct}, ${publicId}, ${format}, ${height}, ${width})
    `;
  });
};

export const OutputVideo = async ({
  id,
  idProduct,
}: {
  id: string;
  idProduct: number;
}) => {
  const query = prisma.$queryRaw<any[]>`
        SELECT upv.description, upv.url, upv.thumbnail_url, upv.duration, upv.hashtag, upv.category, upv.ref_id_product, upv.cloud_public_id, upv.format, upv.height, upv.width, up.folder_name, up.created_at
        FROM users_product_video upv
        JOIN users_product up ON (up.id_product = upv.ref_id_product)
        JOIN users u ON (u.id = up.ref_id)
        WHERE upv.ref_id_product = ${idProduct} AND u.id = ${id}::uuid
    `;
  if (!query) return [];

  return camelcaseKeys(query);
};
