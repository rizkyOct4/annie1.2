"use client";

import {
  useQuery,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import axios from "axios";
import { ROUTES_PROFILE } from "../config";
import {
  usePost,
  usePut,
  usePutFolderName,
  usePutGrouped,
  useDeleteGrouped,
} from "./sub/use-sub-photo";
import { ROUTES_LIST_FOLDER } from "../config/list-folder";
import { ROUTES_ITEM_FOLDER } from "../config/item-folder";
import { ROUTES_CREATOR_PHOTO_PANEL } from "../config/routes-panel";
import { SortASC } from "@/_util/GenerateData";
import { TPhotoDescription } from "../types/panel/description/type";
import type {
  UseCreatorPhotoParams,
  UseDescriptionParams,
} from "../context/type";
import { useParams } from "next/navigation";

// * CONTENT ====
const useCreatorPhoto = ({
  stateContent,
  stateFolder,
  updateState,
  id,
  type,
}: UseCreatorPhotoParams) => {
  const { type: currentPath } = useParams<{ type: string }>();

  // ! START LIST FOLDERS ==========================
  const {
    data: listFolderPhoto,
    fetchNextPage: FNPListFolderPhoto,
    hasNextPage: HNPListFolderPhoto,
    isFetchingNextPage: IFNPListFolderPhoto,
    refetch: refetchFolder,
  } = useInfiniteQuery({
    queryKey: ["keyListFolderPhoto", id, type],
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
    enabled: type === currentPath,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });
  // ! END LIST FOLDERS ==========================

  // ! START CONTENT ==========================
  // * List Item Folder
  const { data: listItemFolder, isFetching: isFetchingListItemFolder } =
    useInfiniteQuery({
      queryKey: [
        "keyListItemFolder",
        id,
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
      enabled:
        !!stateContent.year && !!stateContent.month && type === currentPath,
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
      refetchOnMount: false, // "always" => refetch jika stale saja
      retry: false,
    });

  // * Items Folder
  const {
    data: itemFolderPhoto,
    isLoading: isLoadingItemFolderPhoto,
    isFetching: isFetchingItemFolder,
    fetchNextPage: fetchNextPageItemFolder,
    hasNextPage: isHasPageItemFolder,
    isFetchingNextPage: isFetchingNextPageItemFolder,
    refetch: refetchItemFolder,
  } = useInfiniteQuery({
    queryKey: ["keyItemFolderPhoto", id, stateFolder.isFolder],
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
    enabled: !!stateFolder.isFolder && type === currentPath,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });
  // ! END CONTENT ==========================

  // console.log(itemFolderPhoto)
  // * UPDATE DATA
  const { data: getUpdatePhoto } = useQuery({
    queryKey: ["keyUpdatePhoto", id, updateState],
    queryFn: async () => {
      const URL = ROUTES_PROFILE.GET_BTN({
        key: "getUpdate",
        path: type,
        idProduct: updateState,
      });
      const { data } = await axios.get(URL);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!updateState,
    gcTime: 1000 * 60 * 60, // Cache data akan disimpan selama 1 jam
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false,
    retry: false,
  });

  // ? LIST FOLDERS DATA
  const listFolderData = useMemo(
    () => listFolderPhoto?.pages.flatMap((page) => page?.data ?? []),
    [listFolderPhoto?.pages]
  );

  // ? ITEMS
  const listItemFolderPhotoData = useMemo(
    () => listItemFolder?.pages.flatMap((page) => page.data) ?? [],
    [listItemFolder?.pages]
  );

  const itemFolderPhotoData = useMemo(
    () => itemFolderPhoto?.pages.flatMap((page) => page.data) ?? [],
    [itemFolderPhoto?.pages]
  );
  const sortItemFolder = useMemo(
    () => SortASC(itemFolderPhotoData),
    [itemFolderPhotoData]
  );

  // ? UPDATED DATA
  const UpdatedData = useMemo(() => getUpdatePhoto ?? [], [getUpdatePhoto]);

  // * ====== SUB =======
  const { postPhoto } = usePost({
    refetchFolder: refetchFolder,
    keyFolder: ["keyListFolderPhoto", id, type],
    keyListFolder: [
      "keyListItemFolder",
      id,
      stateContent?.year,
      stateContent?.month,
    ],
    keyItemFolder: ["keyItemFolderPhoto", id, stateFolder.isFolder],
    rawKeyItemFolder: {
      key: "keyItemFolderPhoto",
      id: id,
      postFolder: stateFolder.isFolder,
    },
    type: type,
  });
  const { putPhoto } = usePut({
    keyListFolder: [
      "keyListItemFolder",
      id,
      stateContent?.year,
      stateContent?.month,
    ],
    keyItemFolder: ["keyItemFolderPhoto", id, stateFolder.isFolder],
    keyUpdatePhoto: ["keyUpdatePhoto", id, updateState],
    rawKeyItemFolder: {
      key: "keyItemFolderPhoto",
      id: id,
      updateFolder: stateFolder.isFolder,
    },
    type: type,
  });

  // * UPDATE NEW NAME FOLDER
  const { updateNameFolder } = usePutFolderName({
    keyFolder: ["keyListFolderPhoto", id, type],
    keyListItemFolder: [
      "keyListItemFolder",
      id,
      stateContent.year,
      stateContent.month,
    ],
    keyItemFolder: ["keyItemFolderPhoto", id, stateFolder.isFolder],
    keyUpdatePhoto: ["keyUpdatePhoto", id, updateState],
    type: type,
  });
  const { groupedPutPhoto } = usePutGrouped({
    keyFolder: ["keyListFolderPhoto", id, type],
    keyListItemFolder: [
      "keyListItemFolder",
      id,
      stateContent.year,
      stateContent.month,
    ],
    keyItemFolder: ["keyItemFolderPhoto", id, stateFolder.isFolder],
    rawKeyItemFolder: {
      key: "keyItemFolderPhoto",
      id: id,
      folder: stateFolder.isFolder,
    },
    keyUpdatePhoto: ["keyUpdatePhoto", id, updateState],
    rawKeyUpdatePhoto: {
      key: "keyUpdatePhoto",
      id: id,
      idProduct: updateState,
    },
    type: type,
  });

  // * DELETE IMAGE
  const { groupedDeletePhoto } = useDeleteGrouped({
    keyFolder: ["keyListFolderPhoto", id, type],
    keyListItemFolder: [
      "keyListItemFolder",
      id,
      stateContent.year,
      stateContent.month,
    ],
    keyItemFolder: ["keyItemFolderPhoto", id, stateFolder.isFolder],
    type: type,
  });
  // console.log(itemFolderPhoto);

  return {
    // * LIST FOLDER PHOTO
    listFolderData,
    FNPListFolderPhoto,
    HNPListFolderPhoto,
    IFNPListFolderPhoto,

    // ? DATA
    isFetchingListItemFolder,
    listItemFolderPhotoData,

    // ? DATA
    itemFolderPhotoData,
    isLoadingItemFolderPhoto,
    isFetchingItemFolder,
    fetchNextPageItemFolder,
    isHasPageItemFolder,
    isFetchingNextPageItemFolder,
    refetchItemFolder,

    // * UTLS
    sortItemFolder,
    refetchFolder,

    // ? DATA UPDATE
    UpdatedData,

    // ? ACTION
    postPhoto,
    putPhoto,
    groupedPutPhoto,
    groupedDeletePhoto,
    updateNameFolder,
  };
};

const useDescription = ({
  id,
  panel,
  folderName,
  idProduct,
  type,
}: UseDescriptionParams) => {
  const { data: descriptionItemFolderPhoto } = useQuery({
    queryKey: ["keyDescriptionItemFolder", id, panel, folderName, idProduct],
    queryFn: async () => {
      const URL = ROUTES_CREATOR_PHOTO_PANEL.GET({
        typeConfig: "panelDescriptionPhoto",
        prevPath: type,
        currentPath: panel,
        folderName: folderName,
        id: idProduct,
      });
      const { data } = await axios.get(URL);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!panel && !!idProduct,
    gcTime: 1000 * 60 * 60, // Cache data akan disimpan selama 1 jam
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false,
    retry: false,
  });
  const descriptionItemFolderData: TPhotoDescription[] = useMemo(
    () => descriptionItemFolderPhoto ?? [],
    [descriptionItemFolderPhoto]
  );

  return { descriptionItemFolderData };
};

// ? ===============
const useCreatorButton = (id: string) => {
  const [typeBtn, setTypeBtn] = useState<string>("");

  // * LIST POST FOLDER
  const {
    data: listPostFolder,
    isLoading: isLoadingListPost,
    refetch: refetchListPostFolder,
  } = useQuery({
    queryKey: ["listFolderPost", id, typeBtn],
    queryFn: async () => {
      const URL = ROUTES_PROFILE.GET_BTN({ key: typeBtn, typeBtn: typeBtn });
      const { data } = await axios.get(URL);
      return data;
    },
    enabled: typeBtn !== "",
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  const ListPostFolderData = useMemo(
    () => listPostFolder ?? [],
    [listPostFolder]
  );

  // console.log(ListPostFolderData);

  return {
    listPostFolder,
    isLoadingListPost,
    ListPostFolderData,
    setTypeBtn,
    refetchListPostFolder,
  };
};

export { useCreatorPhoto, useDescription, useCreatorButton };
