"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams, useParams } from "next/navigation";
import { useMemo } from "react";
import { CATEGORY } from "@/config/api/sidebar/discover/category/api";
import axios from "axios";
import { ListCategoryType } from "../type";


const useCategory = (publicId: string) => {
  const { type } = useParams<{ type?: string }>();
  const id = useSearchParams().get("id") ?? "";
  // console.log(id);

  const URL = CATEGORY("listCategory", type);

  // * List Category
  const { data: listCategory } = useQuery({
    queryKey: ["listCategory", publicId, type],
    queryFn: async () => {
      const { data } = await axios.get(URL);
      return data;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 60, // Cache data akan disimpan selama 1 jam
    enabled: !!type,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  // * Description Category
  const { data: descriptionCategory } = useQuery({
    queryKey: ["descriptionCategory", publicId, id],
    queryFn: undefined,
    staleTime: 1000 * 60 * 1,
    enabled: !!id,
    gcTime: 1000 * 60 * 60, // Cache data akan disimpan selama 1 jam
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  const keyDescription = ["descriptionCategory", publicId, id];

  const listCategoryData: ListCategoryType[] = useMemo(
    () => listCategory,
    [listCategory]
  );

  const descriptionCategoryData = useMemo(
    () => descriptionCategory,
    [descriptionCategory]
  );

  return { listCategoryData, descriptionCategoryData, keyDescription };
};

export { useCategory };
