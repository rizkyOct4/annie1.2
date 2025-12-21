"use client";

import { useRouter } from "next/navigation";
import { memo } from "react";

const ActivePath = ({ currentPath }: { currentPath: string }) => {
  const router = useRouter();
  const typeBtn = ["photo", "video"];

  return (
    <div className="flex items-center gap-6">
      {typeBtn.map((name, idx) => {
        const isActive = currentPath === name;

        return (
          <button
            key={idx}
            onClick={() => router.push(`/creator/${name}`)}
            className={`
          relative
          px-2 py-1
          text-sm font-semibold
          transition-colors duration-300
          ${
            isActive
              ? "text-white after:scale-x-100 after:bg-black"
              : "text-gray-500 hover:text-black after:scale-x-0 hover:after:scale-x-100 after:bg-black/60"
          }
        `}>
            {name}
          </button>
        );
      })}
    </div>
  );
};

export default memo(ActivePath);

// todo PERBAIKI DASHBOARD KAU BESOK !! BUAT SMOOTH !!! 

// todo QUERYCACHE KAU KONDISIKAN LAGI BESOK !! PASTIKAN BERSIH !! 
