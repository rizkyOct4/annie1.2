"use client";

import { ROUTES_PROFILE } from "../../config";
import {
  useQueryClient,
  useMutation,
  InfiniteData,
} from "@tanstack/react-query";
import axios from "axios";
import type {
  TOriginalListFolder,
  TOriginalItemFolder,
  TOriginalUpdated,
} from "../../types/type";
import { showToast } from "@/_util/Toast";
import type { TImagePost, TImagePut } from "../../schema/schema-form";

const usePost = ({
  keyListFolder,
  keyItemFolder,
  type,
}: {
  keyListFolder: Array<string>;
  keyItemFolder: Array<string>;
  type: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: postPhoto } = useMutation({
    mutationFn: async (data) => {
      const URL = ROUTES_PROFILE.ACTION_PHOTO({
        method: "post",
        type: "photo",
        path: type,
      });
      const res = await axios.post(URL, data);
      return res.data;
    },
    onMutate: async (mutate: TImagePost) => {
      showToast({ type: "loading", fallback: true });

      await Promise.all([
        queryClient.cancelQueries({ queryKey: keyListFolder }),
        queryClient.cancelQueries({ queryKey: keyItemFolder }),
      ]);

      const prevListFolderData = queryClient.getQueryData(keyListFolder);
      const prevItemFolderData = queryClient.getQueryData(keyItemFolder);

      queryClient.setQueryData<InfiniteData<TOriginalListFolder>>(
        keyListFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.map((page: any) => {
              const isExist = page.data.some(
                (i: { folderName: string }) =>
                  i.folderName === mutate.folderName
              );
              if (isExist) {
                return {
                  ...page,
                  data: page.data.map(
                    (i: { folderName: string; amountItem: number }) =>
                      i.folderName === mutate.folderName
                        ? { ...i, amountItem: i.amountItem + 1 }
                        : i
                  ),
                };
              } else {
                return {
                  ...page,
                  data: [
                    ...page.data,
                    { folderName: mutate.folderName, amountItem: 1 },
                  ],
                };
              }
            }),
          };
        }
      );

      return { prevListFolderData, prevItemFolderData };
    },
    onSuccess: (response) => {
      const { data } = response;
      showToast({ type: "loading", fallback: false });
      queryClient.setQueryData<InfiniteData<TOriginalItemFolder>>(
        keyItemFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.map((page) => {
              const space = page.hasMore !== true;
              if (space) {
                return {
                  ...page,
                  data: [
                    ...page.data,
                    {
                      folderName: data[0].folderName,
                      idProduct: data[0].idProduct,
                      url: data[0].url,
                      createdAt: data[0].createdAt,
                    },
                  ],
                };
              }
              return page;
            }),
          };
        }
      );
    },
    onError: (error, _variables, context) => {
      showToast({ type: "loading", fallback: false });
      showToast({ type: "error", fallback: error });
      console.error(error);
      if (context?.prevListFolderData && context?.prevItemFolderData) {
        queryClient.setQueryData(keyListFolder, context.prevListFolderData);
        queryClient.setQueryData(keyItemFolder, context.prevItemFolderData);
      }
    },
  });

  return { postPhoto };
};

const usePut = ({
  keyListFolder,
  keyItemFolder,
  keyUpdatePhoto,
  rawKeyItemFolder,
  type,
}: {
  keyListFolder: Array<string>;
  keyItemFolder: Array<string>;
  keyUpdatePhoto: Array<string | null>;
  rawKeyItemFolder?: {
    key: string;
    id: string;
    updateFolder: string;
  } | undefined,
  type: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: putPhoto } = useMutation({
    mutationFn: async (data) => {
      const URL = ROUTES_PROFILE.ACTION_PHOTO({
        method: "put",
        type: "photo",
        path: type,
      });
      const res = await axios.put(URL, data);
      return res.data;
    },
    onMutate: async (mutate: TImagePut) => {
      showToast({ type: "loading", fallback: true });

      await Promise.all([
        queryClient.cancelQueries({ queryKey: keyListFolder }),
        queryClient.cancelQueries({ queryKey: keyItemFolder }),
        queryClient.cancelQueries({ queryKey: keyUpdatePhoto }),
      ]);

      const prevListItemData = queryClient.getQueryData(keyListFolder);
      const prevItemData = queryClient.getQueryData(keyItemFolder);
      const prevUpdated = queryClient.getQueryData(keyUpdatePhoto);

      queryClient.setQueryData<InfiniteData<TOriginalListFolder>>(
        keyListFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.map((page: any) => {
              const isExist = page.data.some(
                (i: { folderName: string }) =>
                  i.folderName === mutate.folderName
              );
              if (isExist) {
                return {
                  ...page,
                  data: page.data.map(
                    (i: { folderName: string; amountItem: number }) =>
                      i.folderName === mutate.folderName
                        ? { ...i, amountItem: i.amountItem + 1 }
                        : i
                  ),
                };
              }
              return page;
            }),
          };
        }
      );

      return { prevListItemData, prevItemData, prevUpdated };
    },
    onSuccess: (response) => {
      const { data } = response;

      // ? UPDATED DATA
      queryClient.setQueryData<TOriginalUpdated[]>(
        keyUpdatePhoto,
        (oldData) => {
          if (!oldData) return [];

          return oldData.map((i) => ({
            ...i,
            folderName: data[0].folderName,
            description: data[0].description,
            imageName: data[0].imageName,
            url: data[0].url,
            hashtag: data[0].hashtag,
            category: data[0].category,
            totalLike: data[0].totalLike,
            totalDislike: data[0].totalDislike,
            createdAt: data[0].createdAt,
          }));
        }
      );

      // ? ITEMS FOLDER
      queryClient.setQueryData<InfiniteData<TOriginalItemFolder>>(
        keyItemFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.map((page: any) => {
              const sameFolder = page.data.some(
                (f: { folderName: string; idProduct: number }) =>
                  f.folderName === data[0].folderName &&
                  f.idProduct === data[0].idProduct
              );
              if (sameFolder) {
                return {
                  ...page,
                  data: page.data.map(
                    (f: { folderName: string; idProduct: number }) =>
                      f.folderName === data[0].folderName &&
                      f.idProduct === data[0].idProduct
                        ? {
                            ...f,
                            url: data[0].url,
                            createdAt: data[0].createdAt,
                          }
                        : f
                  ),
                };
              } else {
                return {
                  ...page,
                  data: page.data.filter(
                    (f: { idProduct: number }) =>
                      f.idProduct !== data[0].idProduct
                  ),
                };
              }
            }),
          };
        }
      );

      if(rawKeyItemFolder?.updateFolder !== data[0].folderName) {
        // * TARGET REFETCH CACHE
        queryClient.invalidateQueries({
          queryKey: [
            rawKeyItemFolder?.key,
            rawKeyItemFolder?.id,
            data[0].folderName,
          ],
          exact: true,
        });
      }

      showToast({ type: "loading", fallback: false });
    },
    onError: (error, _variables, context) => {
      showToast({ type: "loading", fallback: false });
      showToast({ type: "error", fallback: error });
      console.error(error);
      if (
        context?.prevListItemData &&
        context?.prevItemData &&
        context?.prevUpdated
      ) {
        queryClient.setQueryData(keyListFolder, context.prevListItemData);
        queryClient.setQueryData(keyItemFolder, context.prevItemData);
        queryClient.setQueryData(keyUpdatePhoto, context.prevUpdated);
      }
    },
  });

  return { putPhoto };
};

export { usePost, usePut };
