"use client";

import { useRouter } from "next/navigation";
import { memo } from "react";

const ActivePath = ({ currentPath }: { currentPath: string }) => {
  const router = useRouter();
  const typeBtn = ["photo", "video"];

  return (
    <div className="flex items-center gap-4">
      {typeBtn.map((name, idx) => {
        const isActive = currentPath === name;

        return (
          <button
            key={idx}
            onClick={() => router.push(`/creator/${name}`)}
            className={`relative px-4 py-2 text-sm font-semibold transition-colors
            ${
              isActive
                ? "text-black after:w-full after:bg-black"
                : "text-gray-600 hover:text-black after:w-0 hover:after:w-full after:bg-black/50"
            }
            after:absolute after:left-0 after:-bottom-1 after:h-[2px]
            after:transition-all after:duration-300
          `}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};

export default memo(ActivePath);
