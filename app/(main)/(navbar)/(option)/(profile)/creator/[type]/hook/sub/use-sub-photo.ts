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
  TOriginalList,
  TPutFolderName,
} from "../../types/type";
import { showToast } from "@/_util/Toast";
import type { TImagePost, TImagePut } from "../../schema/schema-form";
import { PutGroupedImage } from "../../@content/components/options/option-btn";

const usePost = ({
  keyFolder,
  keyListFolder,
  keyItemFolder,
  type,
}: {
  keyFolder: Array<string>;
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
        queryClient.cancelQueries({ queryKey: keyFolder }),
        queryClient.cancelQueries({ queryKey: keyListFolder }),
        queryClient.cancelQueries({ queryKey: keyItemFolder }),
      ]);

      const prevFolder = queryClient.getQueryData(keyFolder);
      const prevListFolderData = queryClient.getQueryData(keyListFolder);
      const prevItemFolderData = queryClient.getQueryData(keyItemFolder);

      // ? LIST
      queryClient.setQueryData<InfiniteData<TOriginalList>>(
        keyFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.map((page: any) => ({
              ...page,
              data: page.data.map(
                (i: { folder: string[]; totalProduct: number }) => {
                  const isExistFolder = i.folder.includes(mutate.folderName);

                  if (!isExistFolder) {
                    return {
                      ...i,
                      totalProduct: i.totalProduct + 1,
                      folder: [...i.folder, mutate.folderName],
                    };
                  }
                  return i;
                }
              ),
            })),
          };
        }
      );

      // ? LIST FOLDER
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

      return { prevFolder, prevListFolderData, prevItemFolderData };
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
      if (
        context?.prevFolder &&
        context?.prevListFolderData &&
        context?.prevItemFolderData
      ) {
        queryClient.setQueryData(keyFolder, context.prevFolder);
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
  rawKeyItemFolder?:
    | {
        key: string;
        id: string;
        updateFolder: string;
      }
    | undefined;
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

      // ? LIST FOLDER
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

      // * TARGET REFETCH CACHE
      if (rawKeyItemFolder?.updateFolder !== data[0].folderName) {
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

const usePutFolderName = ({
  keyFolder,
  keyListItemFolder,
  keyItemFolder,
  keyUpdatePhoto,
  type,
}: {
  keyFolder: Array<string>;
  keyListItemFolder: Array<string>;
  keyItemFolder: Array<string>;
  keyUpdatePhoto: Array<string | null>;
  type: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateNameFolder } = useMutation({
    mutationFn: async (data) => {
      const URL = ROUTES_PROFILE.ACTION_PHOTO({
        method: "putNameFolder",
        type: "photo",
        path: type,
      });
      const res = await axios.put(URL, data);
      return res.data;
    },
    onMutate: async (mutate: TPutFolderName) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: keyFolder }),
        queryClient.cancelQueries({ queryKey: keyListItemFolder }),
        queryClient.cancelQueries({ queryKey: keyItemFolder }),
        queryClient.cancelQueries({ queryKey: keyUpdatePhoto }),
      ]);

      const prevFolder = queryClient.getQueryData(keyFolder);
      const prevListItemData = queryClient.getQueryData(keyListItemFolder);
      const prevItemData = queryClient.getQueryData(keyItemFolder);
      const prevUpdated = queryClient.getQueryData(keyUpdatePhoto);

      // ? FOLDER
      queryClient.setQueryData<InfiniteData<TOriginalList>>(
        keyFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.map((page: any) => ({
              ...page,
              data: page.data.map((i: { folder: string[] }) => {
                const isExist = i.folder.includes(mutate.targetFolder);
                if (isExist) {
                  return {
                    ...i,
                    folder: i.folder
                      .filter((f) => f !== mutate.targetFolder)
                      .concat(mutate.value),
                  };
                }
                return i;
              }),
            })),
          };
        }
      );

      // ? LIST ITEM FOLDER
      queryClient.setQueryData<InfiniteData<TOriginalListFolder>>(
        keyListItemFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.map((page: any) => ({
              ...page,
              data: page.data.map((i: { folderName: string }) =>
                i.folderName === mutate.targetFolder
                  ? {
                      ...i,
                      folderName: mutate.value,
                    }
                  : i
              ),
            })),
          };
        }
      );

      // ? ITEM FOLDER
      if (prevItemData) {
        queryClient.setQueryData<InfiniteData<TOriginalItemFolder>>(
          keyItemFolder,
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData?.pages.map((page: any) => ({
                ...page,
                page: page.data.map((i: { folderName: string }) => ({
                  ...i,
                  folderName: mutate.value,
                })),
              })),
            };
          }
        );
      }

      // ? UPDATED DATA
      if (prevUpdated) {
        queryClient.setQueryData<TOriginalUpdated[]>(
          keyUpdatePhoto,
          (oldData) => {
            if (!oldData) return oldData;
            return oldData.map((i) => ({
              ...i,
              folderName: mutate.value,
            }));
          }
        );
      }

      return { prevFolder, prevListItemData, prevItemData, prevUpdated };
    },
    onError: (error, _variables, context) => {
      showToast({ type: "loading", fallback: false });
      showToast({ type: "error", fallback: error });
      console.error(error);
      if (
        context?.prevFolder &&
        context?.prevListItemData &&
        context?.prevItemData &&
        context?.prevUpdated
      ) {
        queryClient.setQueryData(keyFolder, context.prevFolder);
        queryClient.setQueryData(keyListItemFolder, context.prevListItemData);
        queryClient.setQueryData(keyItemFolder, context.prevItemData);
        queryClient.setQueryData(keyUpdatePhoto, context.prevUpdated);
      }
    },
  });
  return { updateNameFolder };
};

const usePutGrouped = ({
  keyFolder,
  keyListItemFolder,
  keyItemFolder,
  keyUpdatePhoto,
  rawKeyUpdatePhoto,
  type,
}: {
  keyFolder: Array<string>;
  keyListItemFolder: Array<string>;
  keyItemFolder: Array<string>;
  keyUpdatePhoto: Array<string | number | null>;
  rawKeyUpdatePhoto?: {
    key: string;
    id: string;
    idProduct: number | null;
  };
  type: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: groupedPutPhoto } = useMutation({
    mutationFn: async (data) => {
      const URL = ROUTES_PROFILE.ACTION_PHOTO({
        method: "groupedPutImage",
        type: "photo",
        path: type,
      });
      const res = await axios.put(URL, data);
      return res.data;
    },
    onMutate: async (mutate: PutGroupedImage) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: keyFolder }),
        queryClient.cancelQueries({ queryKey: keyListItemFolder }),
        queryClient.cancelQueries({ queryKey: keyItemFolder }),
        queryClient.cancelQueries({ queryKey: keyUpdatePhoto }),
      ]);

      const prevFolder = queryClient.getQueryData(keyFolder);
      const prevListItemData = queryClient.getQueryData(keyListItemFolder);
      const prevItemData = queryClient.getQueryData(keyItemFolder);
      const prevUpdatePhoto = queryClient.getQueryData(keyUpdatePhoto);

      // ? LIST FOLDER
      queryClient.setQueryData<InfiniteData<TOriginalListFolder>>(
        keyListItemFolder,
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data
                .map((i: { folderName: string; amountItem: number }) => {
                  if (i.folderName === mutate.prevFolder) {
                    return {
                      ...i,
                      amountItem: i.amountItem - mutate.idProduct.length,
                    };
                  }

                  if (i.folderName === mutate.targetFolder) {
                    return {
                      ...i,
                      amountItem: i.amountItem + mutate.idProduct.length,
                    };
                  }

                  return i;
                })
                .filter((f) => f.amountItem !== 0),
            })),
          };
        }
      );

      // ? ITEM FOLDER
      queryClient.setQueryData<InfiniteData<TOriginalItemFolder>>(
        keyItemFolder,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData?.pages.map((page: any) => ({
              ...page,
              data: page.data.filter(
                (f: { idProduct: number }) =>
                  !mutate.idProduct.includes(f.idProduct)
              ),
            })),
          };
        }
      );

      // ? UPDATED DATA
      if (prevUpdatePhoto) {
        queryClient.setQueryData<TOriginalUpdated[]>(
          keyUpdatePhoto,
          (oldData) => {
            if (!oldData) return oldData;

            return oldData.map((i) => {
              // ? FIND MENGEMBALIKAN DATA !!!
              const updated = mutate.idProduct.find((m) => m === i.idProduct);

              if (updated) {
                return {
                  ...i,
                  folderName: mutate.targetFolder,
                };
              }
              return i;
            });
          }
        );
      }
      return { prevFolder, prevListItemData, prevItemData, prevUpdatePhoto };
    },
    onSuccess: (response) => {
      const { data } = response;

      // queryClient.setQueryData(keyFolder, (oldData) => {
      //   if(!oldData) return oldData


      // })

      // TODO KONDISIKAN BESOK INI SAMA KAU !! BUAT FOLDER KEY INI KETIKA GROUP PUT DATANYA HILANG JIKA TOTAL = 0

      console.log(response);
    },
    onError: (error, _variables, context) => {
      showToast({ type: "loading", fallback: false });
      showToast({ type: "error", fallback: error });
      console.error(error);
      if (
        context?.prevFolder &&
        context?.prevListItemData &&
        context?.prevItemData &&
        context?.prevUpdatePhoto
      ) {
        queryClient.setQueryData(keyFolder, context.prevFolder);
        queryClient.setQueryData(keyListItemFolder, context.prevListItemData);
        queryClient.setQueryData(keyItemFolder, context.prevItemData);
        queryClient.setQueryData(keyUpdatePhoto, context.prevUpdatePhoto);
      }
    },
  });

  return { groupedPutPhoto };
};

export { usePost, usePut, usePutFolderName, usePutGrouped };
