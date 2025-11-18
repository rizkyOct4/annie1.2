"use client";

import {
  useQueryClient,
  useMutation,
  InfiniteData,
} from "@tanstack/react-query";
import axios from "axios";
import { ROUTES_CREATORS } from "@/app/(main)/(sidebar)/(discover)/creators/config";
import type { OriginalCreatorListData } from "../../type";
import { PostDataLike } from "../../@modal/(.)[publicId]/type";

const usePost = (
  publicIdUser: string,
  targetId: string,
  listCreatorKey: any[]
) => {
  const queryClient = useQueryClient();

  const URL = ROUTES_CREATORS.POST({ key: "likePost", params: targetId });

  const { mutateAsync: postLikePhoto } = useMutation({
    mutationFn: async (data) => await axios.post(URL, data),
    onMutate: async (mutate: PostDataLike) => {
      await queryClient.cancelQueries({
        queryKey: listCreatorKey,
      });

      const prevListProductData = queryClient.getQueryData(listCreatorKey);

      // ? type InfiniteData<T> = {
      // ? pages: T[];
      // ? pageParams: unknown[];
      // }

      queryClient.setQueryData<InfiniteData<OriginalCreatorListData>>(
        listCreatorKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.flatMap((page) => ({
              ...page,
              data: page?.data.map((i) =>
                i.iuProduct === mutate.tar_iu_product
                  ? {
                      ...i,
                      totalLike: (i.totalLike ?? 0) + mutate.like,
                      status: mutate.status,
                    }
                  : i
              ),
            })),
          };
        }
      );

      return { prevListProductData };
    },
    onError: (error, _variables, context) => {
      console.error(error);
      if (context?.prevListProductData) {
        queryClient.setQueryData(listCreatorKey, context.prevListProductData);
      }
    },
  });
  return { postLikePhoto };
};

export { usePost };
