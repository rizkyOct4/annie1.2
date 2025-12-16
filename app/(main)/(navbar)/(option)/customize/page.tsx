import type { Metadata } from "next";
import ProfileCustomize from "./components/modal";
import { Suspense } from "react";
import GetToken from "@/_lib/middleware/get-token";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/get-query-client";
import { GetCustomize } from "@/_lib/services/navbar/option/customize";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Profile Customize",
  description: "Customize whatever you wanted !! Enjoy ",
};

const page = async () => {
  const { id } = await GetToken();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["keyCustomize", id],
    queryFn: () => GetCustomize({ publicId: id }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading />}>
        <ProfileCustomize />
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;

// ! SSR -> NO CACHE SERVER, JUST KEEP FETCHING EVERY USERS IN OUT !!
// ! DEHYDRATE -> LITERALLY JUST SENDING DATA INTO CLIENT(BROWSER) !! THATS IT
// ! PARENT PAGE KAU ! COBA BESOK FETCH TEMBAK LANGSUNG KE DB !!
