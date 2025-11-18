import { QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { TokenHelper } from "@/_lib/tokenHelper";

const Fetching = async () => {
  const queryClient = new QueryClient();
  const cookieHeader = (await cookies()).toString();
  const token = (await cookies()).get("access_token")?.value;
  const { publicId } = (await TokenHelper(token)) || {};
  return { queryClient, cookieHeader, publicId };
};

// * ISG
const ISGQuery = async ({
  queryKey,
  config,
  queryClient,
}: {
  queryKey: any[];
  config: string;
  queryClient: QueryClient;
}) => {
  return await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      // ? URL => string
      const URL = config;
      const res = await fetch(URL, {
        next: { revalidate: 60 * 5 },
      });
      return res.json();
    },
  });
};

// * SSR Infinite
const SSRInfiniteQuery = async ({
  queryKey,
  config,
  typeConfig,
  path,
  queryClient,
}: {
  queryKey: any[];
  config: Function;
  typeConfig: string;
  path: string;
  queryClient: QueryClient;
}) => {
  const cookieHeader = (await cookies()).toString();

  return await queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      let URL = "";

      switch (path) {
        // * NAVBAR
        case "photo": {
          URL = config({
            typeConfig: typeConfig,
            type: path,
            pageParam: pageParam,
          });
          break;
        }
        // * SIDEBAR
        case "creators": {
          URL = config({
            typeConfig: typeConfig,
            pageParams: pageParam,
            publicId: path,
          });
          break;
        }
      }

      const res = await fetch(URL, {
        headers: { Cookie: cookieHeader },
        next: { revalidate: 60 * 3 },
      });
      return res.json();
    },
    initialPageParam: 1,
  });
};

export { ISGQuery, SSRInfiniteQuery };

export default Fetching;
