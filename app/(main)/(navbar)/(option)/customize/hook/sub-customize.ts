"use client";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CONFIG_CUSTOMIZE } from "../config/config-customize";
import { TCustomizeData, TPostCustomize } from "../schema/schema-customize";

export const useCustomizePost = ({ queryKey }: { queryKey: Array<string> }) => {
  const queryClient = useQueryClient();
  const { mutateAsync: postCustomize } = useMutation({
    mutationFn: async (post: TPostCustomize) => {
      const URL = CONFIG_CUSTOMIZE.POST({ typeConfig: "CSRPostCustomize" });
      const { data } = await axios.post(URL, post);
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKey,
      });
      const prevCustomizeData = queryClient.getQueryData(queryKey);

      return { prevCustomizeData };
    },
    onSuccess: (response) => {
      const { returnDb } = response;
      queryClient.setQueryData(queryKey, (oldData: TCustomizeData[]) => {
        if (!oldData) return [];

        return oldData.map((i) => ({
          ...i,
          username: returnDb[0].username,
          biodata: returnDb[0].biodata,
          gender: returnDb[0].gender,
          phoneNumber: returnDb[0].phoneNumber,
          location: returnDb[0].location,
          picture: returnDb[0].picture,
          socialLink: returnDb[0].socialLink,
        }));
      });
    },
    onError: (error, _variables, context) => {
      //   showToast({ type: "loading", fallback: false });
      //   showToast({ type: "error", fallback: error });
      console.error(error);
      if (context?.prevCustomizeData) {
        queryClient.setQueryData(queryKey, context.prevCustomizeData);
      }
    },
  });

  return { postCustomize };
};

// todo TEST BESOK SAMA KAU POSTING DESCRIPTION !!!
// todo BERSIHKAN DATABASE !! CLOUD JUGA !! OAUTH LOGIN -> PICTURENYA MASUKKAN KE USER_DESCRIPTION !!
