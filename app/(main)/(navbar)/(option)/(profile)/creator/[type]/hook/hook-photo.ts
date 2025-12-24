"use client";

import {
  useQuery,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { ROUTES_PROFILE } from "../config";
import {
  usePost,
  usePut,
  usePutFolderName,
  usePutGrouped,
} from "./sub/use-sub-photo";
import { ROUTES_LIST_FOLDER } from "../config/list-folder";
import { ROUTES_ITEM_FOLDER } from "../config/item-folder";
import { ROUTES_CREATOR_PHOTO_PANEL } from "../config/routes-panel";
import { SortASC } from "@/_util/GenerateData";
import { TPhotoDescription } from "../types/panel/description/type";

// * CONTENT ====
const useContentProfile = (id: string) => {
  const { type } = useParams<{ type: string }>();
  const [stateContent, setStateContent] = useState({
    year: "",
    month: "",
  });
  const [stateFolder, setStateFolder] = useState({
    isOpen: false,
    isFolder: "",
    isIuProduct: null,
  });

  // ? UPDATE STATE
  const [updateState, setUpdateState] = useState(null);

  // ? SORT ITEMS DATA
  const [isSort, setIsSort] = useState(false);

  // ! START LIST FOLDERS ==========================
  const {
    data: listFolderPhoto,
    fetchNextPage: FNPListFolderPhoto,
    hasNextPage: HNPListFolderPhoto,
    isFetchingNextPage: IFNPListFolderPhoto,
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
    enabled: !!type,
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
      enabled: !!stateContent.year && !!stateContent.month,
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
    refetch: isRefetchItemFolder,
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
    enabled: !!stateFolder.isFolder,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });
  // ! END CONTENT ==========================


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
  // console.log(getUpdatePhoto)

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
    keyFolder: ["keyListFolderPhoto", id, type],
    keyListFolder: [
      "keyListItemFolder",
      id,
      stateContent?.year,
      stateContent?.month,
    ],
    keyItemFolder: ["keyItemFolderPhoto", id, stateFolder.isFolder],
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
    keyUpdatePhoto: ["keyUpdatePhoto", id, updateState],
    rawKeyUpdatePhoto: {
      key: "keyUpdatePhoto",
      id: id,
      idProduct: updateState
    },
    type: type,
  });

  // console.log(itemFolderPhoto);

  return {
    // ? STATE
    setStateContent,
    stateFolder,
    setStateFolder,

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
    isRefetchItemFolder,

    // * UTLS
    sortItemFolder,
    isSort,
    setIsSort,

    // ? DATA UPDATE
    UpdatedData,
    setUpdateState,

    // ? ACTION
    postPhoto,
    putPhoto,
    groupedPutPhoto,

    // * UPDATE NEW NAME FOLDER
    updateNameFolder,

    // * CURRENT-PATH
    type,
  };
};

const useItemDescription = (id: string) => {
  const { type, panel } = useParams<{ type: string; panel: string }>();
  const folderName = useSearchParams().get("folder-name") ?? "";
  const idDesc = useSearchParams().get("id") ?? "";

  const { data: descriptionItemFolderPhoto } = useQuery({
    queryKey: ["keyDescriptionItemFolder", id, panel, folderName, idDesc],
    queryFn: async () => {
      const URL = ROUTES_CREATOR_PHOTO_PANEL.GET({
        typeConfig: "panelDescriptionPhoto",
        prevPath: type,
        currentPath: panel,
        folderName: folderName,
        id: idDesc,
      });
      const { data } = await axios.get(URL);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!panel && !!idDesc,
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

    // UpdatePhotoData,
    // setIuProduct,
    // isLoadingUpdatePhoto,
  };
};

export {
  useContentProfile,
  useItemDescription,
  // useCreatorPhoto,
  useCreatorButton,
};
