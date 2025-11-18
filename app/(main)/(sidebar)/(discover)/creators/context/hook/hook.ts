"use client";

import { ROUTES_CREATORS } from "@/app/(main)/(sidebar)/(discover)/creators/config";
import {
  useQuery,
  keepPreviousData,
  useInfiniteQuery,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CreatorDescriptionType, ListCreatorProductType } from "../../type";
import { usePost } from "./Post";
import { ModalState } from "../../types/interface";

const useCreators = () => {
  const path = "creators";
  // * List Creators
  const {
    data: listCreators,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["keyListCreators", path],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        ROUTES_CREATORS.GET({ typeConfig: path, pageParams: pageParam })
      );
      return data;
    },

    // ? ketika melakukan fetchNextPage maka akan memanggil queryFn kembali
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 60,
    initialPageParam: 1,
    enabled: !!path,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  // ? useInfiniteQuery menyimpan hasil di dalam data.pages, kamu bisa akses begini:
  const listCreatorsData = useMemo(
    () => listCreators?.pages.flatMap((page) => page.data) ?? [],
    [listCreators?.pages]
  );

  console.log(listCreators)
  console.log(listCreatorsData)

  return { listCreatorsData, fetchNextPage, hasNextPage, isFetchingNextPage };
};

const useCreatorsDescription = (publicIdUser: string) => {
  const queryClient = useQueryClient();

  const { publicId } = useParams<{ publicId: string }>();

  const [open, setOpen] = useState<ModalState>({
    isOpen: true,
    isValue: "Profile",
    isPublicId: null,
  });

  // * Creators Description
  const { data: creatorDescription } = useQuery({
    queryKey: ["keyCreatorDescription", publicIdUser, publicId],
    queryFn: async () => {
      const queryKey = ["keyCreatorDescription", publicIdUser, publicId]
      if (queryClient.getQueryData(queryKey)) {
        const URL = ROUTES_CREATORS.GET({
          typeConfig: "creatorsDescription",
          publicId: publicId,
        });
        const { data } = await axios.get(URL);
        return data;
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!publicId,
    gcTime: 1000 * 60 * 60, // Cache data akan disimpan selama 1 jam
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  // * List Creators Product
  const {
    data: listProductCreators,
    fetchNextPage: fetchNextPageProduct,
    hasNextPage: hasNextPageProduct,
    isFetchingNextPage: isFetchingNextPageProduct,
  } = useInfiniteQuery({
    queryKey: ["keyListProductCreators", publicIdUser, publicId],
    queryFn: async ({ pageParam = 1 }) => {
      const URL = ROUTES_CREATORS.GET({
        typeConfig: "listCreatorsProduct",
        pageParams: pageParam,
        publicId: publicId,
      });
      const { data } = await axios.get(URL);
      return data;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 60,

    // ? ketika melakukan fetchNextPage maka akan memanggil queryFn kembali
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!publicId && open.isValue === "Products",
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  // ? child hook
  const listCreatorKey = ["keyListProductCreators", publicIdUser, publicId];

  const { postLikePhoto } = usePost(publicIdUser, publicId, listCreatorKey);

  const creatorDescriptionData: CreatorDescriptionType = useMemo(
    () => creatorDescription ?? [],
    [creatorDescription]
  );
  const listCreatorProductData: ListCreatorProductType[] = useMemo(
    () => listProductCreators?.pages.flatMap((page) => page.data) ?? [],
    [listProductCreators?.pages]
  );

  return {
    creatorDescriptionData,
    listCreatorProductData,
    fetchNextPageProduct,
    hasNextPageProduct,
    isFetchingNextPageProduct,

    // ? state
    open,
    setOpen,

    // ? child
    postLikePhoto,
  };
};

export { useCreators, useCreatorsDescription };
