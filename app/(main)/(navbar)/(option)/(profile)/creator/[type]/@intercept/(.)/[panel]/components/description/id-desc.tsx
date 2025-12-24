"use client";

import { memo } from "react";
import Image from "next/image";
import type { TPhotoDescription } from "../../../../../types/panel/description/type";

const ItemDescription = ({ data }: { data: TPhotoDescription[] }) => {
  return (
    <div className="space-y-6">
      {Array.isArray(data) &&
        data.length > 0 &&
        data.map((i) => (
          <div
            key={i.idProduct}
            className="
              rounded-xl p-5
              bg-black/30
              border border-white/10
              transition
              hover:bg-black/40
              relative
            ">
            {/* DESCRIPTION */}
            <div className="text-lg font-semibold text-gray-200 mb-3">
              {i.description}
            </div>

            {/* IMAGE */}
            <Image
              width={400}
              height={300}
              src={i.url}
              alt={i.description}
              className="rounded-lg mb-4 border border-white/10"
            />

            {/* HASHTAG */}
            <div className="flex flex-wrap gap-2 mb-3">
              {i.hashtag.map((tag: string) => (
                <span
                  key={tag}
                  className="
                    text-xs px-2 py-1 rounded-md
                    bg-blue-500/10 text-blue-300
                    border border-blue-500/20
                  ">
                  #{tag}
                </span>
              ))}
            </div>

            {/* CATEGORY */}
            <div className="flex flex-wrap gap-2 mb-4">
              {i.category.map((cat: string) => (
                <span
                  key={cat}
                  className="
                    text-xs px-2 py-1 rounded-md
                    bg-emerald-500/10 text-emerald-300
                    border border-emerald-500/20
                  ">
                  {cat}
                </span>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>
                ❤️ {i.totalLike} &nbsp; | &nbsp; 💔 {i.totalDislike}
              </div>
              <div>
                {new Date(i.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default memo(ItemDescription);
