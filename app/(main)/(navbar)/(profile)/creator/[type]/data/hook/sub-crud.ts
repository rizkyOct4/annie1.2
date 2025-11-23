"use client";

import { ROUTES_PROFILE } from "@/app/(main)/(navbar)/(profile)/creator/[type]/config";
import {
  useQueryClient,
  useMutation,
  InfiniteData,
} from "@tanstack/react-query";
import axios from "axios";
import type { PhotoPostType } from "../@photo/components/Post";
import type {
  OriginalListFolderType,
  OriginaItemFolderType,
} from "../../type/type";
import { showToast } from "@/_util/Toast";
import { ItemFolderDescriptionType } from "../../type/type";

const usePost = ({
  keyListFolder,
  keyItemFolder,
  type,
}: {
  keyListFolder: any[];
  keyItemFolder: any[];
  type: string;
}) => {
  const queryClient = useQueryClient();

  const URL = ROUTES_PROFILE.CRUD_IMAGE({
    method: "post",
    type: "photo",
    path: type,
  });

  const { mutateAsync: postPhoto } = useMutation({
    mutationFn: async (data) =>
      await axios.post(URL, data, {
        withCredentials: true, // kalau perlu cookie/session
      }),
    onMutate: async (mutate: PhotoPostType) => {
      showToast({ type: "loading", fallback: true });

      await queryClient.cancelQueries({
        queryKey: keyListFolder,
      });

      const prevListFolderData = queryClient.getQueryData(keyListFolder);

      queryClient.setQueryData<InfiniteData<OriginalListFolderType>>(
        keyListFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.flatMap((page: any) => {
              const isExist = page.data.some(
                (i: { folderName: string }) =>
                  i.folderName === mutate.folderName
              );
              if (isExist) {
                return {
                  ...page,
                  data: page.data.map((i: { folderName: string; totalProduct: number }) =>
                    i.folderName === mutate.folderName
                      ? { ...i, totalProduct: i.totalProduct + 1 }
                      : i
                  ),
                };
              } else {
                return {
                  ...page,
                  data: [
                    ...page.data,
                    { folderName: mutate.folderName, totalProduct: 1 },
                  ],
                };
              }
            }),
          };
        }
      );

      return { prevListFolderData };
    },
    onSuccess: (response) => {
      const { data } = response.data;
      showToast({ type: "loading", fallback: false });
      queryClient.setQueryData<InfiniteData<OriginaItemFolderType>>(
        keyItemFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.flatMap((page) => ({
              ...page,
              data: [
                ...page.data,
                { tarIuProduct: data[0].tarIuProduct, url: data[0].url },
              ],
            })),
          };
        }
      );
    },
    onError: (error, _variables, context) => {
      showToast({ type: "loading", fallback: false });
      showToast({ type: "error", fallback: error });
      console.error(error);
      if (context?.prevListFolderData) {
        queryClient.setQueryData(keyListFolder, context.prevListFolderData);
      }
    },
  });

  return { postPhoto };
};

const usePut = ({
  keyDescriptionItem,
  keyItemFolder,
  type,
}: {
  keyDescriptionItem: any[];
  keyItemFolder: any[];
  type: string;
}) => {
  const queryClient = useQueryClient();

  const URL = ROUTES_PROFILE.CRUD_IMAGE({
    method: "put",
    type: "photo",
    path: type,
  });

  const { mutateAsync: putPhoto } = useMutation({
    mutationFn: async (data) =>
      await axios.put(URL, data, {
        withCredentials: true, // kalau perlu cookie/session
      }),
    onMutate: async () => {
      showToast({ type: "loading", fallback: true });

      await queryClient.cancelQueries({
        queryKey: keyDescriptionItem,
      });

      const prevDescriptionItemData =
        queryClient.getQueryData(keyDescriptionItem);

      return { prevDescriptionItemData };
    },
    onSuccess: (response) => {
      const { data } = response.data;

      // ? DESCTIPTION
      queryClient.setQueryData<ItemFolderDescriptionType[]>(
        keyDescriptionItem,
        (oldData) => {
          if (!oldData) return [];

          return oldData.map((i) => ({
            ...i,
            description: data[0].description,
            hashtag: data[0].hashtag,
            category: data[0].category,
            url: data[0].url,
            createdAt: data[0].createdAt,
          }));
        }
      );

      // ? ITEMS FOLDER
      queryClient.setQueryData<InfiniteData<OriginaItemFolderType>>(
        keyItemFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.flatMap((page: any) => ({
              ...page,
              data: page.data.map((s: { tarIuProduct: number }) =>
                s.tarIuProduct === data[0].tarIuProduct
                  ? {
                      ...s,
                      url: data[0].url,
                    }
                  : s
              ),
            })),
          };
        }
      );

      showToast({ type: "loading", fallback: false });
    },
    onError: (error, _variables, context) => {
      showToast({ type: "loading", fallback: false });
      showToast({ type: "error", fallback: error });
      console.error(error);
      if (context?.prevDescriptionItemData) {
        queryClient.setQueryData(
          keyDescriptionItem,
          context.prevDescriptionItemData
        );
      }
    },
  });

  return { putPhoto };
};

export { usePost, usePut };
