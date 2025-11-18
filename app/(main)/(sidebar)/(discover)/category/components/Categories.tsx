"use client";

import { useContext, useCallback } from "react";
import { CategoriesType } from "../page";
import { useRouter } from "next/navigation";
import { categoryContext } from "@/app/context";
import { useQueryClient } from "@tanstack/react-query";
import { CATEGORY } from "@/config/api/sidebar/discover/category/api";
import axios from "axios";

const CategoryCard = ({
  staticData,
  path,
}: {
  staticData: CategoriesType[];
  path: string;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { publicId } = useContext(categoryContext);

  const handlePrefetch = useCallback(
    async (path: string) => {
      const queryKey = ["typeCategory", publicId, path];

      if (!queryClient.getQueryData(queryKey)) {
        const URL = CATEGORY("typeCategory", path);

        await queryClient.prefetchQuery({
          queryKey,
          queryFn: async () => {
            const { data } = await axios(URL);
            return data;
          },
        });
      }
    },
    [queryClient, publicId]
  );

  return (
    <div className="flex flex-wrap gap-4">
      {staticData.map((i) => (
        <button
          key={i.name}
          onClick={() => router.push(`/${path}/${i.path}`)}
          onMouseEnter={() => handlePrefetch(i.path)}
          className="
            flex-1
            min-w-[220px]
            max-w-sm
            bg-white
            dark:bg-gray-800
            rounded-2xl
            shadow-md
            hover:shadow-lg
            transition-shadow
            duration-300
            p-4
            text-left
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
              flex-shrink-0 
              w-12 h-12 
              rounded-xl 
              bg-blue-500/10 
              flex items-center justify-center
              text-blue-600 text-2xl
            "
            >
              {i.icon}
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {i.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {i.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CategoryCard;
