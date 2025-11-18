"use client";

import { CategoriesType } from "@/types/sidebar/category/Type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const TypeCategory = ({ data }: { data: CategoriesType[] }) => {
  const router = useRouter();
  const path = usePathname().replace("/", "");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>{/* Tombol back dsb */}</div>
        <div>{/* Dropdown dsb */}</div>
      </div>

      {/* Gallery */}
      <div className="flex flex-wrap gap-6">
        {data.map((i) => (
          <div
            key={i.id_unique_product}
            className="
              flex-1 min-w-[240px] max-w-sm 
              bg-white dark:bg-gray-800 
              rounded-2xl overflow-hidden 
              shadow-md hover:shadow-xl 
              transition-shadow duration-300
            "
          >
            <Image
              src={i.image_url}
              alt={i.description}
              width={400} // pixel width yang kamu mau
              height={160} // pixel height yang kamu mau
              className="w-full h-40 object-cover rounded-t-2xl"
            />

            <div className="p-4 flex items-start gap-3">
              <Image
                src={i.creator_picture || "/placeholder-avatar.png"} // fallback aman
                alt="creator"
                width={40} // harus ditentukan
                height={40} // harus ditentukan
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(i.created_at).toLocaleDateString()}
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {i.description || "Untitled"}
                </p>
                <button
                  onClick={() =>
                    router.push(`/${path}?id=${i.id_unique_product}`)
                  }
                >
                  {`>`}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeCategory;
