"use client";

import {
  useQueryClient,
  useMutation,
  InfiniteData,
} from "@tanstack/react-query";
import { ROUTES_PROFILE } from "../../config";
import axios from "axios";
import {
  TOriginalList,
  TOriginalListFolder,
  TOriginalItemsVideo,
} from "../../types/type";
import type { TPostVideo } from "../../form/video/post-video-form";
import { showToast } from "@/_util/Toast";

export const usePostVideo = ({
  refetchFolderVideo,
  keyFolderVideo,
  keyListFolderVideo,
  keyItemsVideo,
  type,
}: {
  refetchFolderVideo: Function;
  keyFolderVideo: Array<string>;
  keyListFolderVideo: Array<string>;
  keyItemsVideo: Array<string>;
  type: string;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: postVideo } = useMutation({
    mutationFn: async (data) => {
      const URL = ROUTES_PROFILE.ACTION_VIDEO({
        method: "postVideo",
        type: "video",
        path: type,
      });
      const res = await axios.post(URL, data);
      return res.data;
    },
    onMutate: async (mutate: TPostVideo) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: keyFolderVideo }),
        queryClient.cancelQueries({ queryKey: keyListFolderVideo }),
        queryClient.cancelQueries({ queryKey: keyItemsVideo }),
      ]);

      const prevFolderVideo = queryClient.getQueryData(keyFolderVideo);
      const prevListFolderVideo = queryClient.getQueryData(keyListFolderVideo);
      const prevItemsVideo = queryClient.getQueryData(keyItemsVideo);

      // ? FOLDERS
      queryClient.setQueryData<InfiniteData<TOriginalList>>(
        keyFolderVideo,
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
        keyListFolderVideo,
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

      // ? ITEMS
      queryClient.setQueryData<InfiniteData<TOriginalItemsVideo>>(
        keyItemsVideo,
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
                      folderName: mutate.folderName,
                      idProduct: mutate.idProduct,
                      duration: mutate.duration,
                      url: mutate.url,
                      thumbnailUrl: mutate.thumbnailUrl,
                    },
                  ],
                };
              }
              return page;
            }),
          };
        }
      );

      return { prevFolderVideo, prevListFolderVideo, prevItemsVideo };
    },
    onSuccess: () => {
      const firstVideo = queryClient.getQueryData(keyFolderVideo);
      if (!firstVideo) return refetchFolderVideo();
    },
    onError: (error, _variables, context) => {
      showToast({ type: "error", fallback: error });
      console.error(error);
      if (
        context?.prevFolderVideo &&
        context?.prevListFolderVideo &&
        context?.prevItemsVideo
      ) {
        queryClient.setQueryData(keyFolderVideo, context.prevFolderVideo);
        queryClient.setQueryData(
          keyListFolderVideo,
          context.prevListFolderVideo
        );
        queryClient.setQueryData(keyItemsVideo, context.prevItemsVideo);
      }
    },
  });

  return { postVideo };
};
