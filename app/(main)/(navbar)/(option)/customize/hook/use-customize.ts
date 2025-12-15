"use client";

import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { CONFIG_CUSTOMIZE } from "../config/config-customize";
import axios from "axios";
import { useMemo } from "react";

export const useCustomize = ({
  publicId,
  currentPath,
}: {
  publicId: string;
  currentPath: string;
}) => {
  const queryClient = useQueryClient();

  const { data: fetchData } = useQuery({
    queryKey: ["keyCustomize", publicId],
    queryFn: async () => {
      const URL = CONFIG_CUSTOMIZE.GET({
        typeConfig: "CSRgetCustomize",
      });
      const { data } = await axios.get(URL);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!currentPath && !!publicId,
    gcTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  //   console.log(customizeData);
  const customizeData = useMemo(() => fetchData ?? [], [fetchData]);

  //   console.log(`customize data:`, customizeData);

  return { customizeData };
};
