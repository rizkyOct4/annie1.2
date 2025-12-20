import { prisma } from "@/_lib/db";
import camelcaseKeys from "camelcase-keys";

// ? LIST ITEM FOLDER
export const ListItemFolderPhoto = async ({
  id,
  path,
  year,
  month,
  limit,
  offset,
}: {
  id: string;
  path: string;
  year: number;
  month: number;
  limit: number;
  offset: number;
}) => {
  // "use cache";
  // cacheLife("minutes");
  // cacheTag(`folders-photo-${id}`);

  const dataRaw = await prisma.$queryRaw<any[]>`
        SELECT up.folder_name, COUNT(up.folder_name)::int AS amount_item
          FROM users_product up
          JOIN users u ON (u.id = up.ref_id)
        WHERE u.id = ${id}::uuid
          AND EXTRACT(YEAR FROM up.created_at)::int = ${year}
          AND EXTRACT(MONTH FROM up.created_at)::int = ${month}
          AND up.type = ${path}::type_product
        GROUP BY
          up.folder_name
        LIMIT ${limit}
        OFFSET ${offset}
    `;

  // ? JIKA ADA FOLDER_NAME YG SAMA MAKA GROUPKAN MENJADI 1
  const queryCheck = await prisma.$queryRaw<{ amount_folder: number }[]>`
        SELECT COUNT(DISTINCT up.folder_name)::int AS amount_folder
        FROM users_product up
        JOIN users u ON (u.id = up.ref_id)
        WHERE u.id = ${id}::uuid
        AND EXTRACT(YEAR FROM up.created_at)::int = ${year}
        AND EXTRACT(MONTH FROM up.created_at)::int = ${month}
        AND up.type = ${path}::type_product
    `;

  const data = camelcaseKeys(dataRaw);
  const hasMore = offset + limit < Number(queryCheck[0].amount_folder);

  return { data, hasMore };
};

// ? ITEM FOLDER
export const ItemFolderPhoto = async ({
  path,
  folderName,
  limit,
  offset,
}: {
  path: string;
  folderName: string;
  limit: number;
  offset: number;
}) => {
  // "use cache";
  // cacheLife("minutes");
  // cacheTag(`item-folder-photo-${folderName}`);

  const query = await prisma.$queryRaw<
    {
      folder_name: string;
      ref_id_product: number;
      url: string;
      created_at: Date;
    }[]
  >`
    SELECT up.folder_name, up.created_at, upi.ref_id_product, upi.url
    FROM users_product_image upi
    JOIN users_product up ON (up.id_product = upi.ref_id_product)
    WHERE up.folder_name = ${folderName} AND up.type = ${path}::type_product
    ORDER BY up.created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
    `;

  const dataRaw = query.map((i) => ({
    folderName: i.folder_name,
    idProduct: i.ref_id_product,
    url: i.url,
    created_at: i.created_at,
  }));

  const queryCheck = await prisma.$queryRaw<{ amount_item: number }[]>`
      SELECT COUNT(up.folder_name) AS amount_item
      FROM users_product up
      JOIN users u ON (u.id = up.ref_id)
      WHERE up.folder_name = ${folderName}`;

  const hasMore = offset + limit < Number(queryCheck[0].amount_item);

  const data = camelcaseKeys(dataRaw);

  return { data, hasMore };
};
