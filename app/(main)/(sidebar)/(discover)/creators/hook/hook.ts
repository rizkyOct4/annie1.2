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
// import { usePost } from "./Post";
import { usePost } from "./sub/use-post-creators";
import { ModalState } from "../types/interface";
import type {
  TTargetCreatorsDescription,
  TListCreatorProduct,
} from "../types/type";

const useCreators = (id: string) => {
  const currentPath = "creators";
  // * List Creators
  const {
    data: listCreators,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["keyListAllCreators", currentPath, id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        ROUTES_CREATORS.GET({ typeConfig: currentPath, pageParams: pageParam })
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
    enabled: !!currentPath,
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
  // console.log(listCreators)

  return { listCreatorsData, fetchNextPage, hasNextPage, isFetchingNextPage };
};

const useCreatorsDescription = (id: string) => {
  // const queryClient = useQueryClient();
  const { id: targetId } = useParams<{ id: string }>();

  const [open, setOpen] = useState<ModalState>({
    isOpen: true,
    isValue: "Profile",
    isPublicId: null,
  });

  // * Creators Description
  const { data: creatorDescription } = useQuery({
    queryKey: ["keyTargetCreatorDescription", id, targetId],
    queryFn: async () => {
      const URL = ROUTES_CREATORS.GET({
        typeConfig: "creatorsDescription",
        targetId: targetId,
      });
      const { data } = await axios.get(URL);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!targetId,
    gcTime: 1000 * 60 * 60, // Cache data akan disimpan selama 1 jam
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  // * List Creators Photos
  const {
    data: listProductCreators,
    fetchNextPage: fetchNextPageProduct,
    hasNextPage: hasNextPageProduct,
    isFetchingNextPage: isFetchingNextPageProduct,
  } = useInfiniteQuery({
    queryKey: ["keyListProductCreators", id, targetId],
    queryFn: async ({ pageParam = 1 }) => {
      const URL = ROUTES_CREATORS.GET({
        typeConfig: "listCreatorsProduct",
        pageParams: pageParam,
        targetId: targetId,
        key: "photo",
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
    enabled: !!targetId && open.isValue === "Photos",
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  // console.log(listProductCreators)
  // * List Creators Videos
  const {
    data: listProductCreatorsVideo,
  } = useInfiniteQuery({
    queryKey: ["keyListProductCreatorsVideo", id, targetId],
    queryFn: async ({ pageParam = 1 }) => {
      const URL = ROUTES_CREATORS.GET({
        typeConfig: "listCreatorsProductVideo",
        pageParams: pageParam,
        targetId: targetId,
        key: "video",
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
    enabled: !!targetId && open.isValue === "Videos",
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  // console.log(listProductCreatorsVideo)

  // ? child hook
  const { postLikePhoto } = usePost({
    id: id,
    targetId: targetId,
    keyListProductCreators: ["keyListProductCreators", id, targetId],
  });

  const creatorDescriptionData: TTargetCreatorsDescription[] = useMemo(
    () => creatorDescription ?? [],
    [creatorDescription]
  );
  const listCreatorProductData: TListCreatorProduct[] = useMemo(
    () => listProductCreators?.pages.flatMap((page) => page.data) ?? [],
    [listProductCreators?.pages]
  );

  // console.log(listCreatorProductData);

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
