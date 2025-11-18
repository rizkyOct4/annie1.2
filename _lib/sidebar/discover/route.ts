import { prisma } from "@/_lib/db";
import {
  TypeCategoryTypes,
  TypeCategoryDescriptionTypes,
} from "./type";

// ? ini untuk totalCategories
// export const totalCategoryAPI = async ({ path }: { path: string }) => {
//   const query = await prisma.$queryRaw<
//     { categories: string; total_categories: number }[]
//   >`SELECT upc.categories, COUNT(upc.categories)::int AS total_categories
//             FROM users_product up
//             LEFT JOIN product_image_categories upc ON (up.id_unique_product = upc. ref_id_u_product)
//             GROUP BY upc.categories`;

//   return query;
//   //   return NextResponse.json({
//   //     message: "ok",
//   //     data: query, // ini array, bisa langsung di-return
//   //   });
// };

// export const SpesificCategoryAPI = async ({
//   path,
//   idUniqueProduct,
//   category,
// }: {
//   path: string;
//   idUniqueProduct: number;
//   category: string;
// }) => {
//   const query =
//     await prisma.$queryRaw`SELECT ups.total_read, COALESCE(upv.total_like, 0) AS total_like, COALESCE(upv.total_dislike, 0) AS total_dislike, up.id_unique_product, u.id_unique AS creator_id_unique, COALESCE(uf.status, 0) AS status_follow, COALESCE(upb.status, 0) AS bookmark_status, COALESCE(upc.total_comment, 0) AS total_comment
//                 FROM users_product up
//                 LEFT JOIN (
//                     SELECT ref_id_u_product,
//                     COALESCE(SUM(like_count), 0) AS total_like,
//                     COALESCE(SUM(dislike_count), 0) AS total_dislike
//                     FROM product_image_vote
//                     GROUP BY ref_id_u_product
//                     ) AS upv ON (upv.ref_id_u_product = up.id_unique_product)
//                 LEFT JOIN (
//                     SELECT ref_id_u_product, COUNT(ref_id_u_product) AS total_read
//                     FROM users_static
//                     WHERE ref_id_u_product = ${} AND categories = ${}
//                     GROUP BY ref_id_u_product, categories
//                     ) AS ups ON ups.ref_id_u_product = up.id_unique_product
//                 JOIN users u ON (u.id_unique = up.ref_id_u) AND u.id_unique = ${}
//                 LEFT JOIN users_followers uf ON u.id_unique = uf.ref_id_u_receiver AND uf.ref_id_u_sender = ${}
//                 LEFT JOIN product_image_bookmark upb ON upb.ref_id_u_product = up.id_unique_product AND upb.ref_id_u_users = ${} AND upb.ref_id_u_product = ${}
//                 LEFT JOIN (
//                     SELECT ref_id_u_product, COUNT(text) AS total_comment
//                     FROM product_image_comment
//                     WHERE ref_id_u_product = ${} IS NOT NULL
//                     GROUP BY ref_id_u_product
//                     ) AS upc ON (upc.ref_id_u_product = up.id_unique_product)
//                 WHERE up.id_unique_product = ${}`;
//   return; //
// };

export const TypeCategory = async (category: string) => {
  try {
    // ? jika kolom tabel berisi array, maka pakai ANY(kolom tabelnya) !!!!
    const query = await prisma.$queryRaw<
      TypeCategoryTypes[]
    >`SELECT upi.tar_iu_product, upi.description, upi.url, up.created_at
      FROM users_product_image upi
      JOIN users_product up ON (up.iu_product = upi.tar_iu_product)
      WHERE ${category} = ANY(upi.category)
      ORDER BY up.created_at ASC
      LIMIT ${10}
    `;

    // if (query.length === 0) throw new Error("No Data");
    if (!query) return [];

    return query.map((row: TypeCategoryTypes) => ({
      iuProduct: row.tar_iu_product,
      url: row.url,
      createdAt: row.created_at,
    }));
  } catch (err) {
    throw err;
  }
};

export const TypeCategoryDescription = async (searchQuery: number) => {
  try {
    const query = await prisma.$queryRaw<
      TypeCategoryDescriptionTypes[]
    >`SELECT upi.tar_iu_product, upi.description, upi.url, upi.hashtag, upi.category, COALESCE(COUNT(upiv.like), 0)::int AS total_like,  COALESCE(COUNT(upiv.dislike), 0)::int AS total_dislike, up.created_at
      FROM users_product_image upi
      JOIN users_product up ON (up.iu_product = upi.tar_iu_product)
      LEFT JOIN users_product_image_vote upiv ON (upiv.tar_iu_product = upi.tar_iu_product)
      WHERE upi.tar_iu_product = ${searchQuery}
      GROUP BY
      upi.tar_iu_product, upi.description, upi.url, upi.hashtag, upi.category, up.created_at
    `;

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
  } catch (err) {
    throw err;
  }
};
