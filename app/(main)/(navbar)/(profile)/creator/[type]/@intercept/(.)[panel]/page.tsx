import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ModalPanel from "./modal";
import { ISGQuery } from "@/_util/fetch";
import Fetching from "@/_util/fetch";
import { ROUTES_CREATOR_PHOTO_PANEL } from "../../config/config-panel";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; panel: string }>;
  searchParams: Promise<{
    "folder-name"?: string;
    id?: string;
  }>;
}) => {
  const { queryClient, publicId } = await Fetching();

  const prevPath = (await params).type;
  const currentPath = (await params).panel;
  const pathFolderName = (await searchParams)?.["folder-name"] ?? "";
  const id = (await searchParams).id ?? "";

  const queryKeyDescription = [
    "keyDescriptionItemFolder",
    publicId,
    currentPath,
    pathFolderName,
    id,
  ];
  switch (currentPath) {
    // case "stats": {
    //   break;
    // }
    case "description": {
      const config = ROUTES_CREATOR_PHOTO_PANEL.GET({
        typeConfig: "panelDescriptionPhoto",
        prevPath: prevPath,
        currentPath: currentPath,
        folderName: pathFolderName,
        id: id,
      });
      await ISGQuery({
        queryKey: queryKeyDescription,
        config: config,
        queryClient: queryClient,
      });
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ModalPanel currentPath={currentPath} />
    </HydrationBoundary>
  );
};

export default page;

// ? Fitur	ISG (Incremental Static Generation)
// Static / Cache	Ya, statis tapi bisa direvalidate
// Update otomatis	Hanya saat revalidate atau rebuild
// Cocok untuk	Data publik, sama untuk semua user
// Tidak cocok untuk	Data dinamis per user / butuh auth / query params unik

// todo BACA ISG, SSG DLL !!! ISG KAU MASIH SALAH !!! IDK WHY !! FIXKAN BESOK !!!
// todo SSG ++++ iasdiojoaslkdm
// ! LIAT FETCH.ts !!!