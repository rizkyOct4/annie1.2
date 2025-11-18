"use client";

import { creatorContext } from "@/app/context";
import { useContext, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ItemDescription = () => {
  const { descriptionItemFolderData } = useContext(creatorContext);

  const router = useRouter();

  return (
    <div
      className="overlay"
      onClick={(e) => {
        e.stopPropagation();
        router.back();
      }}
    >
      <div className="space-y-4 p-4 bg-neutral-50 rounded-2xl shadow-sm">
        {Array.isArray(descriptionItemFolderData) &&
          descriptionItemFolderData.length > 0 &&
          descriptionItemFolderData.map((item) => (
            <div
              key={item.tarIuProduct}
              className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="font-semibold text-gray-900 text-lg mb-2">
                {item.description}
              </div>

              <Image
                width={200}
                height={192}
                src={item.url}
                alt={item.description}
                className="w-auto h-auto object-cover rounded-lg mb-3"
              />

              <div className="flex flex-wrap gap-2 mb-2">
                {item.hashtag.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {item.category.map((cat: string) => (
                  <span
                    key={cat}
                    className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                <div>
                  ❤️ {item.totalLike} &nbsp; | &nbsp; 💔 {item.totalDislike}
                </div>
                <div>
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default memo(ItemDescription);
