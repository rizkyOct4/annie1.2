import type { Metadata } from "next";
import ProfileCustomize from "./components/modal";
import { Suspense } from "react";
import { SSRQueryPr } from "@/_util/model-fetch/private";
import GetToken from "@/_lib/middleware/get-token";
import { CONFIG_CUSTOMIZE } from "./config/config-customize";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/get-query-client";

export const metadata: Metadata = {
  title: "Profile Customize",
  description: "Customize whatever you wanted !! Enjoy ",
};

const page = async () => {
  const { id } = await GetToken();
  const queryClient = getQueryClient();

  // const isExist = !!queries[0]?.queryKey
  // console.log("All queries:", queries[0].queryKey);

  // if (!data) {
  await SSRQueryPr({
    queryKey: ["keyCustomize", id],
    config: CONFIG_CUSTOMIZE.GET({ typeConfig: "SSRgetCustomize" }),
    queryClient: queryClient,
  });
  // }
  // console.log(queryClient);
  // const queries = queryClient.getQueryCache().getAll();

  // console.log(queries);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center text-gray-200">
            Loading profile...
          </div>
        }>
        <ProfileCustomize />
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;



// ! SSR -> NO CACHE SERVER, JUST KEEP FETCHING EVERY USERS IN OUT !!
// ! DEHYDRATE -> LITERALLY JUST SENDING DATA INTO CLIENT(BROWSER) !! THATS IT
// ! PARENT PAGE KAU ! COBA BESOK FETCH TEMBAK LANGSUNG KE DB !!