import { prisma } from "@/_lib/db";
import camelcaseKeys from "camelcase-keys";
import type { TGetCustomize } from "./type-customize";
import { cache } from "react";
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

export const PostCustomize = () => {
  return;
};
