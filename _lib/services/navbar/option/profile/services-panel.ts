import { prisma } from "@/_lib/db";
import camelcaseKeys from "camelcase-keys";

// import type { TItemFolderDescription } from "./type";

// ? ITEM DESCRIPTION
export const ItemFolderDescription = async (idProduct: number, id: string) => {
  // const query = await prisma.$queryRaw<any[]>`
  //     SELECT upi.ref_id_product, upi.description, upi.image_name, upi.url, upi.hashtag, upi.category, COUNT(*) FILTER (WHERE upiv.status = 'like')::int AS total_like, COUNT(*) FILTER (WHERE upiv.status = 'dislike')::int AS total_dislike, up.folder_name, up.created_at
  //     FROM users_product_image upi
  //     JOIN users_product up ON (up.id_product = upi.ref_id_product)
  //     JOIN users u ON (u.id = up.ref_id)
  //     JOIN users_photo_stats ups ON (ups.ref_id_product = up.id_product)
  //     WHERE upi.ref_id_product = ${idProduct} AND u.public_id = ${id}
  //     GROUP BY
  //       upi.description,
  //       upi.ref_id_product,
  //       upi.url,
  //       upi.image_name,
  //       upi.hashtag,
  //       upi.category,
  //       up.folder_name,
  //       up.created_at
  //     `;
  const query = await prisma.$queryRaw<any[]>`
      SELECT upi.ref_id_product, upi.description, upi.image_name, upi.url, upi.hashtag, upi.category, ups.like AS total_like, ups.dislike AS total_dislike, up.folder_name, up.created_at
      FROM users_product_image upi
      JOIN users_product up ON (up.id_product = upi.ref_id_product)
      JOIN users u ON (u.id = up.ref_id)
      JOIN users_photo_stats ups ON (ups.ref_id_product = up.id_product)
      WHERE upi.ref_id_product = ${idProduct} AND u.public_id = ${id}
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
