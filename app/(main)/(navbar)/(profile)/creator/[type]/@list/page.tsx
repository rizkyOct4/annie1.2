import ListFolder from "./components/list-folder";
import Fetching, { SSRInfiniteQuery } from "@/_util/fetch";
import { ROUTES_LIST_FOLDER } from "../config/list-folder";

const page = async ({ params }: { params: Promise<{ type: string }> }) => {
  const pathUrl = (await params).type;
  const { queryClient, publicId } = await Fetching();

  await SSRInfiniteQuery({
    queryKey: ["keyListFolder", publicId, pathUrl],
    config: ROUTES_LIST_FOLDER.GET,
    typeConfig: "listFolderPhoto",
    path: pathUrl,
    queryClient: queryClient,
  });

  return <ListFolder />;
};

export default page;
