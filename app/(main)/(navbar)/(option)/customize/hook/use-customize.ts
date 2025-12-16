"use client";

import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { CONFIG_CUSTOMIZE } from "../config/config-customize";
import axios from "axios";
import { useMemo } from "react";
import { TCustomizeData } from "../schema/schema-customize";

// ? SUB
import { useCustomizePost } from "./sub-customize";

export const useCustomize = ({
  publicId,
  currentPath,
}: {
  publicId: string;
  currentPath: string;
}) => {
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

  const { postCustomize } = useCustomizePost({
    queryKey: ["keyCustomize", publicId],
  });

  // ? RESULT DATA
  const customizeData: TCustomizeData[] = useMemo(
    () => fetchData ?? [],
    [fetchData]
  );
  // console.log(`customize data:`, customizeData);

  return {
    customizeData,

    // * SUB HOOK
    postCustomize,
  };
};
