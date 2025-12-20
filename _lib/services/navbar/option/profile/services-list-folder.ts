import { prisma } from "@/_lib/db";
import { cacheLife, cacheTag } from "next/cache";
import camelcaseKeys from "camelcase-keys";

export const ListFolderPhoto = async ({
  id,
  pathUrl,
  limit,
  offset,
}: {
  id: string;
  pathUrl: string;
  limit: number;
  offset: number;
}) => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`list-folders-${id}`);

  const query = await prisma.$queryRaw`
            SELECT 
                EXTRACT(YEAR FROM up.created_at)::int AS year,
                EXTRACT(MONTH FROM up.created_at)::int AS month,
                COUNT(DISTINCT up.folder_name)::int AS total_product
            FROM users_product up
            JOIN users u ON (up.ref_id = u.id)
            WHERE u.id = ${id}::uuid AND up.type = ${pathUrl}::type_product
            GROUP BY year, month
        `;

  const queryCheck = await prisma.$queryRaw<{ year: number }[]>`
        SELECT
            EXTRACT(YEAR FROM up.created_at)::int AS year
        FROM users_product up
        JOIN users u ON (u.id = up.ref_id)
        WHERE u.id = ${id}::uuid AND up.type = ${pathUrl}::type_product
        GROUP BY EXTRACT(YEAR FROM up.created_at)
    `;

  const hasMore =
    Number(queryCheck[0].year) + limit < Number(queryCheck[0].year);

  if (!query) return [];

  const data = camelcaseKeys(query);

  return { data, hasMore };

  // ! 1 QUERY DUMMY + 1 LAGI SUB QUERY ASLI -> DIGABUNGKAN MENJADI 1 !!! PELAJARI LAGI SAMA KAU QUERY NI !!!

  //  ? generate_series(1,12) → buat bulan 1–12

  // ?  generate_series(2025,2025) → tahun 2025 saja (bisa diubah range)

  // ? CROSS JOIN → agar kombinasi bulan + tahun muncul

  // ? json_agg → kumpulkan semua folder dalam satu bulan
  // ? contoh:
  // ? [{"folder_name":"abc","amount_item":5}, {"folder_name":"SAD","amount_item":1}]

  // ? MEMBUAT OBJECT !!
  // ?  jsonb_build_object(
  //                         'folder_name', up.folder_name,
  //                         'amount_item', up.item_count
  //                     )

  // ? FILTER
  // ? kalau bulan tidak punya data → jangan kumpulkan NULL

  // ? LEFT JOIN users_product → supaya bulan/tahun yang tidak punya data tetap muncul

  // ? JOIN users → filter user tertentu

  // ? GROUP BY y.year, m.month, up.folder_name → wajib karena ada COUNT
};

// todo PERBAIKI SEMUA DI PROFILE !!
// TODO LOGIC SERVER -> SERVICES
// TODO REF/TAR DARI CHILD -> PARENT -> BUAT INDEX -> FAST QUERY !!!!

// SELECT
//     y.year::int,
//     m.month::int,
//     COALESCE(
//         json_agg(
//             jsonb_build_object(
//                 'folder_name', up.folder_name,
//                 'amount_item', up.item_count::int
//             )
//         ) FILTER (WHERE up.folder_name IS NOT NULL), '[]'::json
//     ) AS folders
// FROM
//     generate_series(2025, 2025 + ${limit}) AS y(year)
// CROSS JOIN
//     generate_series(1,12) AS m(month)
// JOIN (
//     SELECT
//         EXTRACT(YEAR FROM up.created_at)::int AS year,
//         EXTRACT(MONTH FROM up.created_at)::int AS month,
//         COUNT(DISTINCT up.folder_name)::int AS item_count
//     FROM users_product up
//     JOIN users u ON (up.ref_id = u.id)
//     WHERE u.id = 'aba8d0ae-50e8-4363-8aea-04649ba7535e'::uuid AND up.type = 'photo'::type_product
//     GROUP BY year, month
// ) AS up ON up.year = y.year AND up.month = m.month
// GROUP BY y.year, m.month
// ORDER BY y.year, m.month
// `;
