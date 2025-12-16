// import { QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";

// const NewQueryPath = async () => {
//   const queryClient = new QueryClient();
//   const cookieHeader = (await cookies()).toString();
//   return { queryClient, cookieHeader };
// };

// * ISG
const ISGQueryPr = async ({
  queryKey,
  config,
  queryClient,
}: {
  queryKey: any[];
  config: string;
  queryClient: any;
}) => {
  const cookieHeader = (await cookies()).toString();
  return await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      // ? URL => string
      const URL = config;
      const res = await fetch(URL, {
        headers: { Cookie: cookieHeader },
        next: { revalidate: 60 * 5 },
        cache: "force-cache", // ! ⬅ WAJIB untuk ISG
      });
      if (!res.ok) {
        throw new Error("ISG failed: " + res.status);
      }
      return res.json();
    },
  });
};

// * SSR
const SSRQueryPr = async ({
  queryKey,
  config,
  queryClient,
}: {
  queryKey: any[];
  config: string;
  queryClient: any;
}) => {
  const cookieHeader = (await cookies()).toString();

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      const URL = config;
      const res = fetch(URL, {
        headers: { Cookie: cookieHeader },
      });
      return (await res).json();
    },
  });
};
// // * SSR
// const DirectSSRQueryPr = async ({
//   queryKey,
//   fn,
//   queryClient,
// }: {
//   queryKey: any[];
//   fn: Function;
//   queryClient: any;
// }) => {
//   const cookieHeader = (await cookies()).toString();

//   return queryClient.prefetchQuery({
//     queryKey,
//     queryFn: async () => {
//       const res = fetch(fn, {
//         headers: { Cookie: cookieHeader },
//       });
//       return (await res).json();
//     },
//   });
// };

// * SSR Infinite
const SSRInfiniteQueryPr = async ({
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
        case "photo":
          switch (typeConfig) {
            case "listFolderPhoto": {
              URL = config({
                typeConfig: typeConfig,
                path: path,
                pageParam: pageParam,
              });
              break;
            }
          }
          break;

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

// * SSG
const SSGQueryPr = async ({
  queryKey,
  config,
  queryClient,
}: {
  queryKey: any[];
  config: string;
  queryClient: QueryClient;
}) => {
  //   const cookieHeader = (await cookies()).toString();

  return await queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(config, {
        // headers: { Cookie: cookieHeader },
        cache: "force-cache", // wajib agar hasil build statis tersimpan
      });
      if (!res.ok) {
        throw new Error("SSG failed: " + res.status);
      }
      return res.json();
    },
  });
};

export {
  ISGQueryPr,
  SSRQueryPr,
  // DirectSSRQueryPr,
  SSRInfiniteQueryPr,
  SSGQueryPr,
};
