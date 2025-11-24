import { prisma } from "@/_lib/db";

export const ListFolderPhoto = async ({
  publicId,
  pathUrl,
  limit,
  offset,
}: {
  publicId: string | undefined;
  pathUrl: string;
  limit: number;
  offset: number;
}) => {
  const query = await prisma.$queryRaw`
        SELECT
            y.year,
            m.month,
            COALESCE(
                json_agg(
                    jsonb_build_object(
                        'folder_name', up.folder_name,
                        'amount_item', up.item_count
                    )
                ) FILTER (WHERE up.folder_name IS NOT NULL), '[]'::json
            ) AS folders
        FROM 
            generate_series(2025, 2025) AS y(year)
        CROSS JOIN 
            generate_series(1,12) AS m(month)
        LEFT JOIN (
            SELECT 
                EXTRACT(YEAR FROM up.created_at) AS year,
                EXTRACT(MONTH FROM up.created_at) AS month,
                up.folder_name,
                COUNT(up.folder_name) AS item_count
            FROM users_product up
            JOIN users u ON up.tar_iu = u.iu
            WHERE u.public_id = ${publicId}::uuid AND up.type = ${pathUrl}::type_product
            GROUP BY year, month, folder_name
        ) AS up ON up.year = y.year AND up.month = m.month
        GROUP BY y.year, m.month
        ORDER BY y.year, m.month
        `;

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

  return;
};


// todo PERBAIKI SEMUA DI PROFILE !!
// TODO LOGIC SERVER -> SERVICES 
// TODO REF/TAR DARI CHILD -> PARENT -> BUAT INDEX -> FAST QUERY !!!! 