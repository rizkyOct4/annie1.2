"use client";

import {
  useQuery,
  useQueryClient,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type {
  ListFolderType,
  ItemFolderType,
  ListPostFolderType,
  ItemFolderDescriptionType,
} from "../../type/type";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { ROUTES_PROFILE } from "@/app/(main)/(navbar)/(profile)/creator/[type]/config";
import { usePost, usePut } from "./sub-crud";

const useCreatorButton = (publicId: string) => {
  const [typeBtn, setTypeBtn] = useState<string>("");

  // * LIST POST FOLDER
  const { data: listPostFolder, isLoading: isLoadingListPost } = useQuery({
    queryKey: ["listFolderPost", publicId, typeBtn],
    queryFn: async () => {
      const url = ROUTES_PROFILE.GET_BTN({ key: typeBtn, typeBtn: typeBtn });
      const { data } = await axios.get(url);
      return data;
    },
    enabled: !!typeBtn,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false,
    retry: false,
  });

  const ListPostFolderData: ListPostFolderType[] = useMemo(
    () => listPostFolder,
    [listPostFolder]
  );

  return {
    listPostFolder,
    isLoadingListPost,
    ListPostFolderData,
    setTypeBtn,

    // ? updateDataPhoto
    // UpdatePhotoData,
    // setIuProduct,
    // isLoadingUpdatePhoto,
  };
};

const useCreatorPhoto = (publicId: string) => {
  const { type } = useParams<{ type: string }>();
  const folderNamePath = useSearchParams().get("folder-name");
  const [isIdDescription, setIsIdDescription] = useState(null);
  const idPath = useSearchParams().get("id");

  // * List Folder
  const {
    data: listFolderPhoto,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["keyListFolderPhoto", publicId, type],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        ROUTES_PROFILE.GET({
          typeConfig: "type",
          type: type,
          pageParam: pageParam,
        })
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
    enabled: !!type,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  // * Item Folder
  const {
    data: itemFolderPhoto,
    isLoading: isLoadingItemFolderPhoto,
    // fetchNextPage,
    // hasNextPage,
    // isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["keyItemFolderPhoto", publicId, type, folderNamePath],
    queryFn: async ({ pageParam = 1 }) => {
      const URL = ROUTES_PROFILE.GET({
        typeConfig: "folderName",
        type: type,
        folderName: folderNamePath,
        pageParam: pageParam,
      });
      const { data } = await axios.get(URL, {
        params: { folderName: folderNamePath },
      });
      return data;
    },

    // ? ketika melakukan fetchNextPage maka akan memanggil queryFn kembali
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 60,
    initialPageParam: 1,
    enabled: !!folderNamePath,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });
  ``;

  // * Description item
  const { data: descriptionItemFolderPhoto } = useQuery({
    queryKey: [
      "keyDescriptionItemFolder",
      publicId,
      folderNamePath,
      isIdDescription,
    ],
    queryFn: async () => {
      const URL = ROUTES_PROFILE.GET({
        typeConfig: "id",
        type: type,
        folderName: folderNamePath,
        id: isIdDescription,
      });
      const { data } = await axios.get(URL);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!isIdDescription,
    gcTime: 1000 * 60 * 60, // Cache data akan disimpan selama 1 jam
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false,
    retry: false,
  });

  //   // * UPDATE PHOTO DATA
  // const { data: UpdatePhoto, isLoading: isLoadingUpdatePhoto } = useQuery({
  //   queryKey: ["keyUpdatePhoto", publicId, iuProduct],
  //   queryFn: async () => {
  //     const URL = ROUTES_PROFILE.GET_BTN({
  //       key: "updatePhoto",
  //       path: type,
  //       iuProduct: iuProduct,
  //     });
  //     const { data } = await axios.get(URL);
  //     return data;
  //   },
  //   enabled: !!iuProduct,
  //   staleTime: 1000 * 60 * 1,
  //   gcTime: 1000 * 60 * 60,
  //   placeholderData: keepPreviousData,
  //   refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
  //   refetchOnMount: false,
  //   retry: false,
  // });

  // *** SUB ========================================= ***
  const keyListFolder = ["keyListFolderPhoto", publicId, type];
  const keyItemFolder = ["keyItemFolderPhoto", publicId, type, folderNamePath];
  const keyDescriptionItem = [
    "keyDescriptionItemFolder",
    publicId,
    folderNamePath,
    isIdDescription,
  ];

  const { postPhoto } = usePost({ keyListFolder, keyItemFolder, type });
  const { putPhoto } = usePut({ keyDescriptionItem, type });

  // * DATA =====
  const listFolderData = useMemo(
    () => listFolderPhoto?.pages.flatMap((page) => page.data ?? []),
    [listFolderPhoto?.pages]
  );
  const itemFolderData = useMemo(
    () => itemFolderPhoto?.pages.flatMap((page) => page.data) ?? [],
    [itemFolderPhoto?.pages]
  );
  // const itemFolderData = useMemo(
  //   () =>
  //     itemFolderPhoto?.pages.flatMap((page) => ({
  //       folderName: page.folderName,
  //       data: page.data,
  //     })) ?? [],
  //   [itemFolderPhoto?.pages]
  // );
  const descriptionItemFolderData = useMemo(
    () => descriptionItemFolderPhoto ?? [],
    [descriptionItemFolderPhoto]
  );

  console.log(descriptionItemFolderData)
  // const queryClient = useQueryClient();

  // console.log(queryClient.getQueryCache().getAll());

  return {
    listFolderData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    // ? ====
    itemFolderData,
    isLoadingItemFolderPhoto,

    // ? === DESCRIPTION ===
    descriptionItemFolderData,
    // setIuProduct,
    // listFolderData,
    // itemFolderData,
    // descriptionItemFolderData,

    // * SUB - PHOTO ===
    postPhoto,
    putPhoto,

    // * PATH ===
    folderNamePath,
    idPath,

    // * STATE ===
    setIsIdDescription,
  };
};

export { useCreatorPhoto, useCreatorButton };
