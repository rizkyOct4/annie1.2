"use client";

import { useQuery } from "@tanstack/react-query";

const useProfile = (publicId: string) => {
  // * Description Category
  const { data: descriptionCategory } = useQuery({
    queryKey: ["login"],
    // queryFn: undefined,
    staleTime: 1000 * 60 * 1,
    // enabled: !!id,
    cacheTime: 1000 * 60 * 60, // Cache data akan disimpan selama 1 jam
    keepPreviousData: true,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });
};

export { useProfile };
