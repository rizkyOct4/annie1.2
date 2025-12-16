import { prisma } from "@/_lib/db";
import camelcaseKeys from "camelcase-keys";
import type { TGetCustomize } from "./type-customize";
import { cache } from "react";
import sharp from "sharp";
import cloudinary from "@/_lib/cloudinary";
// ! ISG (STATIC)
// ! Kesimpulan: cache() opsional, bisa digunakan kalau ada banyak Server Component yang memanggil fungsi data yang sama saat build.

// Dynamic (SSR)
// 🔹 Ciri halaman

// Dibangun di setiap request

// Bisa menampilkan konten per user

// Data bisa fresh, real-time

export const GetCustomize = cache(
  async ({ publicId }: { publicId: string }) => {
    const query = await prisma.$queryRaw<TGetCustomize[]>`
        SELECT
          ud.username,
          ud.biodata,
          ud.gender,
          ud.phone_number,
          ud.location,
          ud.picture,
          ud.social_link
        FROM users u
        LEFT JOIN users_description ud ON (ud.tar_iu = u.iu)
        WHERE u.public_id = ${publicId}::uuid
    `;
    return camelcaseKeys(query);
  }
);

// ? POST CLOUD
export const PostCloudinary = async ({
  pictureWebp,
  pictureBase,
  publicId,
}: {
  pictureWebp: string;
  pictureBase: string;
  publicId: string;
}) => {
  // ? Check Cloudinary
  // --- 1. Decode base64 jadi buffer ---
  const [header, base64Data] = pictureBase.split(",", 2);
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
          folder: `users picture/${publicId}/`,
          user_picture: pictureWebp, // hapus ekstensi lama
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

export const PostCustomize = async ({
  publicId,
  biodata,
  gender,
  location,
  phoneNumber,
  username,
  socialLink,
  urlCloud,
}: {
  publicId: string;
  biodata?: string;
  gender?: string;
  location?: string;
  phoneNumber?: number;
  username?: string;
  socialLink?: Array<{ platform: string; link: string }[]>;
  urlCloud?: string;
}) => {
  return prisma.$transaction(async (tx) => {
    const iu = await prisma.$queryRaw`
        SELECT iu FROM users WHERE public_id = ${publicId}::uuid
      `;
    // ! DELETE
    await tx.$queryRaw`
          DELETE FROM users_description WHERE tar_iu = ${iu}
        `;

    // * INSERT
    await tx.$queryRaw`
          INSERT INTO users_desciption (tar_iu, username, biodata, gender, phone_number, location, picture, social_link)
          VALUES (${iu}, ${username},${biodata},${gender}::user_gender,${phoneNumber},${location},${urlCloud},${socialLink})
          `;
  });
};

export const PostReturn = async ({ publicId }: { publicId: string }) => {
  const iu = await prisma.$queryRaw`
        SELECT iu FROM users WHERE public_id = ${publicId}::uuid
      `;

  const result = await prisma.$queryRaw<TGetCustomize[]>`
    SELECT username, biodata, gender, phone_number, location, picture, social_link
    FROM users_description
    WHERE tar_iu = ${iu}
  `;

  return camelcaseKeys(result);
};
