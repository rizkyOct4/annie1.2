import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ROUTES_PROFILE } from "@/app/(main)/(navbar)/(profile)/creator/[type]/config";
import FolderList from "./folder-list";
import Fetching, { SSRInfiniteQuery } from "@/_util/fetch";
import ItemDescription from "./id-desc";

const page = async ({ params }: { params: Promise<{ type: string }> }) => {
  const type = (await params).type;
  const { queryClient, publicId } = await Fetching();

  // switch (type) {
  //   case "photo": {
  //     // * LIST FOLDER DATA
  //     const queryKey = ["keyListFolderPhoto", publicId, type];
  //     await SSRInfiniteQuery({
  //       queryKey: queryKey,
  //       config: ROUTES_PROFILE.GET,
  //       typeConfig: "type",
  //       path: type,
  //       queryClient: queryClient,
  //     });
  //     break;
  //   }
  // }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FolderList />
      <ItemDescription />
    </HydrationBoundary>
  );
};

export default page;
