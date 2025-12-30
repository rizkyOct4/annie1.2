import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CreatorsCard from "../creators-card";
import GetToken from "@/_lib/middleware/get-token";
import { getQueryClient } from "@/app/get-query-client";
import { GetAllCreators } from "@/_lib/services/sidebar/discover/creators/services-creators";

const page = async () => {
  const currentPath = "creators";
  // const queryClient = getQueryClient();
  // const { id } = await GetToken();

  // const key = ["keyListAllCreators", currentPath, id];

  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: key,
  //   queryFn: ({ pageParam = 1 }) =>
  //     GetAllCreators({
  //       limit: 10,
  //       offset: (pageParam - 1) * 10,
  //     }),
  //   initialPageParam: 1,
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <CreatorsCard currentPath={currentPath} />
    // </HydrationBoundary>
  );
};

export default page;
