"use client";

import { CREATOR_CRUD } from "@/app/(main)/(navbar)/(profile)/creator/[type]/config";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { PhotoPostType } from "../@photo/components/Post";
import type { ListFolderType, ItemFolderType } from "../../type/type";

const usePost = ({
  listFolderKey,
  itemFolderKey,
}: {
  listFolderKey: (string | undefined)[];
  itemFolderKey: (string | undefined)[];
}) => {
  const queryClient = useQueryClient();

  const URL = CREATOR_CRUD("photoPost", "post", "photo");

  const { mutateAsync: postPhoto } = useMutation({
    mutationFn: async (data) => await axios.post(URL, data),
    onMutate: async (mutate: PhotoPostType) => {
      await queryClient.cancelQueries({
        queryKey: listFolderKey,
      });

      const prevListFolderData =
        queryClient.getQueryData<ListFolderType[]>(listFolderKey);

      if (Array.isArray(prevListFolderData)) {
        queryClient.setQueryData<ListFolderType[]>(listFolderKey, (oldData) => {
          if (!oldData) return [];
          const isExist = prevListFolderData.some(
            (i) => i.folderName === mutate.folderName
          );
          if (isExist) {
            return oldData.map((i) =>
              i.folderName === mutate.folderName
                ? { ...i, totalProduct: i.totalProduct + 1 }
                : i
            );
          } else {
            return [
              ...oldData,
              { folderName: mutate.folderName, totalProduct: 1 },
            ];
          }
        });
      }

      return { prevListFolderData };
    },
    onSuccess: (response) => {
      const { data } = response.data;
      console.log(data);

      const prevItemFolderData =
        queryClient.getQueryData<ItemFolderType[]>(itemFolderKey);

      if (Array.isArray(prevItemFolderData)) {
        queryClient.setQueryData<ItemFolderType[]>(itemFolderKey, (oldData) => {
          if (!oldData) return [];
          return [
            ...oldData,
            {
              tarIuProduct: data.tarIuProduct,
              url: data.url,
            },
          ];
        });
      }
    },
    onError: (error, _variables, context) => {
      //   showToast({ type: "loading", fallback: false });
      console.error(error);
      if (context?.prevListFolderData) {
        queryClient.setQueryData(listFolderKey, context.prevListFolderData);
      }
    },
  });

  return { postPhoto };
};

export { usePost };

// todo GLOBAL CONFIG ROUTE UNTUK CRUD !!! HATI" SAMA INI KAU !! PATHINGNYA !!!
// TODO ROUTE UNTUK GET STATIC !!! UNTUK POST/ PUT/ DEL BISA DIMANIC !! LIAT ROUTENYA BAIK" !!!
