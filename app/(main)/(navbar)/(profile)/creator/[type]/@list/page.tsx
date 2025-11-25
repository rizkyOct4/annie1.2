import ListFolder from "./components/list-folder";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Fetching, { SSRInfiniteQuery } from "@/_util/fetch";
import { ROUTES_LIST_FOLDER } from "../config/list-folder";

const page = async ({ params }: { params: Promise<{ type: string }> }) => {
  const pathUrl = (await params).type;
  const { queryClient, publicId } = await Fetching();

  await SSRInfiniteQuery({
    queryKey: ["keyListFolderPhoto", publicId, pathUrl],
    config: ROUTES_LIST_FOLDER.GET,
    typeConfig: "listFolderPhoto",
    path: pathUrl,
    queryClient: queryClient,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListFolder />
    </HydrationBoundary>
  );
};

export default page;
