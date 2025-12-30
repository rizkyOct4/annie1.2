import { prisma } from "@/_lib/db";
import camelcaseKeys from "camelcase-keys";
import type { TGetCustomize } from "./type-customize";
import sharp from "sharp";
import cloudinary from "@/_lib/cloudinary";
import { cacheLife, cacheTag } from "next/cache";

export const GetCustomize = async ({ id }: { id: string }) => {
  "use cache";
  cacheLife("minutes");
  cacheTag("customize-profile", id);

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
        LEFT JOIN users_description ud ON (ud.ref_id = u.id)
        WHERE u.public_id = ${id}
    `;
  return camelcaseKeys(query);
};

// ? POST CLOUD
export const PostCloudinary = async ({
  pictureWebp,
  picture,
  id,
}: {
  pictureWebp: string;
  picture: string;
  id: string;
}) => {
  // ? Check Cloudinary
  // --- 1. Decode base64 jadi buffer ---
  const [header, base64Data] = picture.split(",", 2);
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
          folder: `users/${id}/`,
          public_id: pictureWebp, // hapus ekstensi lama
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
  id,
  biodata,
  gender,
  location,
  phoneNumber,
  username,
  socialLink,
  urlCloud,
}: {
  id: string;
  biodata?: string;
  gender?: string;
  location?: string;
  phoneNumber?: string;
  username?: string;
  socialLink?: Array<{ platform: string; link: string }[]>;
  urlCloud?: string;
}) => {
  return prisma.$transaction(async (tx) => {
    // ! DELETE
    await tx.$executeRaw`
          DELETE FROM users_description WHERE ref_id = (SELECT id FROM users WHERE public_id = ${id})
        `;
    // * INSERT
    await tx.$executeRaw`
          INSERT INTO users_description (ref_id, username, biodata, gender, phone_number, location, picture, social_link, updated_at)
          VALUES ((SELECT id FROM users WHERE public_id = ${id}), ${username},${biodata},${gender}::user_gender,${phoneNumber},${location},${urlCloud},${JSON.stringify(
      socialLink
    )}::jsonb,  ${new Date()})
          `;
  });
};

export const PostReturn = async ({ id }: { id: string }) => {
  const result = await prisma.$queryRaw<TGetCustomize[]>`
    SELECT username, biodata, gender, phone_number, location, picture, social_link
    FROM users_description
    WHERE ref_id = (SELECT id FROM users WHERE public_id = ${id})
  `;

  return camelcaseKeys(result);
};
