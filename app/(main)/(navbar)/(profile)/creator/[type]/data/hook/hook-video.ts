import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";

const useCreatorVideo = (publicId: string) => {
  // * List Folder
  const { data: listFolderVideo } = useQuery({
    queryKey: ["listVideo"],
    queryFn: undefined,
    // queryFn: async () => {
    //   const { data } = await axios.get(list);
    //   return data.listFolder;
    // },
    staleTime: 1000 * 60 * 1,
    // enabled: !!slug,
    gcTime: 1000 * 60 * 60, // Cache data akan disimpan selama 1 jam
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Tidak refetch saat kembali ke aplikasi
    refetchOnMount: false, // "always" => refetch jika stale saja
    retry: false,
  });

  return { listFolderVideo };
};

export { useCreatorVideo };
