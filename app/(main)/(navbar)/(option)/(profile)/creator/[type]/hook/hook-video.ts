"use client";

import {
  useQuery,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { ROUTES_LIST_FOLDER } from "../config/list-folder";
import { useMemo, useState, useEffect } from "react";
import { usePostVideo } from "./sub/use-sub-video";
import { UseCreatorVideoParams } from "../context/type";
import { ROUTES_ITEM_FOLDER } from "../config/item-folder";

const useCreatorVideo = ({
  stateContent,
  setStateContent,
  stateFolder,
  setStateFolder,
  updateState,
  setUpdateState,
  isSort,
  setIsSort,
  id,
  type,
}: UseCreatorVideoParams) => {
  const { type: currentPath } = useParams<{ type: string }>();

  // * FOLDERS ======
  const { data: listFolderVideo, refetch: refetchFolderVideo } = useInfiniteQuery({
    queryKey: ["keyListFolderVideo", id, type],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        ROUTES_LIST_FOLDER.GET({
          typeConfig: "listFolderVideo",
          path: type,
          pageParam: pageParam,
        })
      );
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 60,
    initialPageParam: 1,
    enabled: type === currentPath,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  // * CONTENT ======
  const {
    data: listItemFolderVideo,
    isFetching: isFetchingListItemFolderVideo,
  } = useInfiniteQuery({
    queryKey: [
      "keyListItemFolderVideo",
      id,
      stateContent.year,
      stateContent.month,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const URL = ROUTES_ITEM_FOLDER.GET({
        typeConfig: "listItemFolderVideo",
        path: type,
        pageParam: pageParam,
        year: stateContent.year,
        month: stateContent.month,
      });
      const { data } = await axios.get(URL);
      return data;
    },

    // ? ketika melakukan fetchNextPage maka akan memanggil queryFn kembali
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 60,
    initialPageParam: 1,
    enabled:
      !!stateContent.year && !!stateContent.month && type === currentPath,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  const {
    data: itemsVideo,
    isLoading: isLoadingItemFolderVideo,
    isFetching: isFetchingItemFolderVideo,
    fetchNextPage: fetchNextPageItemFolder,
    hasNextPage: isHasPageItemFolder,
    isFetchingNextPage: isFetchingNextPageItemFolder,
    refetch: refetchItemsVideo,
  } = useInfiniteQuery({
    queryKey: ["keyItemFolderVideo", id, stateFolder.isFolder],
    queryFn: async ({ pageParam = 1 }) => {
      const URL = ROUTES_ITEM_FOLDER.GET({
        typeConfig: "itemFolderVideo",
        path: type,
        pageParam: pageParam,
        folderName: stateFolder.isFolder,
      });
      const { data } = await axios.get(URL);
      return data;
    },

    // ? ketika melakukan fetchNextPage maka akan memanggil queryFn kembali
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 60,
    initialPageParam: 1,
    enabled: !!stateFolder.isFolder && type === currentPath,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  // console.log(itemsVideo);


  // ? SUB =====
  const { postVideo } = usePostVideo({
    refetchFolderVideo: refetchFolderVideo,
    keyFolderVideo: ["keyListFolderVideo", id, type],
    keyListFolderVideo: [
      "keyListItemFolderVideo",
      id,
      stateContent.year,
      stateContent.month,
    ],
    keyItemsVideo: ["keyItemFolderVideo", id, stateFolder.isFolder],
    type: type,
  });

  // ! DATA
  // * LIST FOLDERS DATA
  const listFolderVideoData = useMemo(
    () => listFolderVideo?.pages.flatMap((page) => page?.data ?? []),
    [listFolderVideo?.pages]
  );

  // * LIST ITEM FOLDER DATA
  const listItemFolderVideoData = useMemo(
    () => listItemFolderVideo?.pages.flatMap((page) => page?.data ?? []),
    [listItemFolderVideo?.pages]
  );
  // *  ITEMS DATA
  const ItemsVideoData = useMemo(
    () => itemsVideo?.pages.flatMap((page) => page?.data ?? []),
    [itemsVideo?.pages]
  );

  return {
    listFolderVideoData,

    // ? CONTENT
    // ? 2
    listItemFolderVideoData,
    isFetchingListItemFolderVideo,

    // ? 3
    ItemsVideoData,
    refetchItemsVideo,
    isFetchingItemFolderVideo,

    // * ACTION
    postVideo,
  };
};

export { useCreatorVideo };
