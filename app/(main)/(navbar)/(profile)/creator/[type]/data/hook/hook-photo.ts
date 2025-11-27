"use client";

import {
  useQuery,
  useQueryClient,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
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
import { ROUTES_LIST_FOLDER } from "../../config/list-folder";
import { ROUTES_ITEM_FOLDER } from "../../config/item-folder";
import { TItemFolderPhoto, TListItemFolderPhoto } from "../../type/content/type";

const useListFolder = (publicId: string) => {
  const { type } = useParams<{ type: string }>();

  const {
    data: listFolderPhoto,
    fetchNextPage: FNPListFolderPhoto,
    hasNextPage: HNPListFolderPhoto,
    isFetchingNextPage: IFNPListFolderPhoto,
  } = useInfiniteQuery({
    queryKey: ["keyListFolderPhoto", publicId, type],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        ROUTES_LIST_FOLDER.GET({
          typeConfig: "listFolderPhoto",
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
    enabled: !!type,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  const listFolderData = useMemo(
    () => listFolderPhoto?.pages.flatMap((page) => page?.data ?? []),
    [listFolderPhoto?.pages]
  );

  // console.log(listFolderPhoto)

  return {
    // * LIST FOLDER PHOTO
    listFolderData,
    FNPListFolderPhoto,
    HNPListFolderPhoto,
    IFNPListFolderPhoto,
  };
};

const useListItemFolder = (publicId: string) => {
  const { type } = useParams<{ type: string }>();
  const [stateContent, setStateContent] = useState({
    year: null,
    month: null,
  });

  // * List Item Folder
  const { data: listItemFolder } = useInfiniteQuery({
    queryKey: [
      "keyListItemFolder",
      publicId,
      stateContent.year,
      stateContent.month,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const URL = ROUTES_ITEM_FOLDER.GET({
        typeConfig: "listItemFolderPhoto",
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
    enabled: !!stateContent.year && !!stateContent.month,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  const listItemFolderPhotoData: TListItemFolderPhoto[] = useMemo(
    () => listItemFolder?.pages.flatMap((page) => page.data) ?? [],
    [listItemFolder?.pages]
  );
  // console.log(listItemFolderPhotoData)

  return {
    // ? STATE
    setStateContent,

    // ? DATA
    listItemFolderPhotoData,
  };
};

const useItemFolder = (publicId: string) => {
  const { type } = useParams<{ type: string }>();
  const [stateFolder, setStateFolder] = useState({
    isOpen: false,
    isFolder: "",
    isIuProduct: null,
  });

  const { data: itemFolderPhoto } = useInfiniteQuery({
    queryKey: ["keyItemFolderPhoto", publicId, stateFolder.isFolder],
    queryFn: async ({ pageParam = 1 }) => {
      const URL = ROUTES_ITEM_FOLDER.GET({
        typeConfig: "itemFolderPhoto",
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
    enabled: !!stateFolder.isFolder,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  const itemFolderPhotoData: TItemFolderPhoto[] = useMemo(
    () => itemFolderPhoto?.pages.flatMap((page) => page.data) ?? [],
    [itemFolderPhoto?.pages]
  );

  // console.log(itemFolderPhotoData)

  return {
    // ? STATE
    stateFolder,
    setStateFolder,

    // ? DATA
    itemFolderPhotoData,
  };
};

const useItemDescription = (publicId: string) => {


    // * Description item
  // const { data: descriptionItemFolderPhoto } = useQuery({
  //   queryKey: [
  //     "keyDescriptionItemFolder",
  //     publicId,
  //     folderNamePath,
  //     isIdDescription,
  //   ],
  //   queryFn: async () => {
  //     const URL = ROUTES_PROFILE.GET({
  //       typeConfig: "id",
  //       type: type,
  //       folderName: folderNamePath,
  //       id: isIdDescription,
  //     });
  //     const { data } = await axios.get(URL);
  //     return data;
  //   },
  //   staleTime: 1000 * 60 * 5,
  //   enabled: !!isIdDescription,
  //   gcTime: 1000 * 60 * 60, // Cache data akan disimpan selama 1 jam
  //   placeholderData: keepPreviousData,
  //   refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
  //   refetchOnMount: false,
  //   retry: false,
  // });
  return
}

// ? ===============

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
    queryKey: ["keyListFolderPhot", publicId, type],
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
    fetchNextPage: fetchNextPageItemFolder,
    hasNextPage: isHasPageItemFolder,
    isFetchingNextPage: isFetchingNextPageItemFolder,
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
  const { putPhoto } = usePut({ keyDescriptionItem, keyItemFolder, type });

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
  const descriptionItemFolderData: ItemFolderDescriptionType[] = useMemo(
    () => descriptionItemFolderPhoto ?? [],
    [descriptionItemFolderPhoto]
  );

  // console.log(itemFolderPhoto);
  // console.log(itemFolderData)
  // console.log(descriptionItemFolderData)

  // const queryClient = useQueryClient();

  // console.log(queryClient.getQueryCache().getAll());

  return {
    // listFolderData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    // ? === ITEM FOLDER ===
    // itemFolderData,
    isLoadingItemFolderPhoto,
    fetchNextPageItemFolder,
    isHasPageItemFolder,
    isFetchingNextPageItemFolder,

    // ? === DESCRIPTION ===
    // descriptionItemFolderData,
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

export {
  useListFolder,
  useListItemFolder,
  useItemFolder,
  useCreatorPhoto,
  useCreatorButton,
};
