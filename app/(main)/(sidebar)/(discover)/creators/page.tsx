import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CreatorsCard from "./creators-card";
import Fetching from "@/_util/fetch";
import { SSRInfiniteQuery } from "@/_util/fetch";
import { ROUTES_CREATORS } from "./config";

const page = async () => {
  const path = "creators";
  const { queryClient } = await Fetching();

  const queryKey = ["keyListCreators", path];

  await SSRInfiniteQuery({
    queryKey: queryKey,
    config: ROUTES_CREATORS.GET,
    typeConfig: path,
    path: path,
    queryClient: queryClient,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreatorsCard url={path} />
    </HydrationBoundary>
  );
};

export default page;

// ! HydrationBoundary itu jembatan antara SSR data React Query di server dan cache di browser. Dia memastikan data hasil prefetch server tidak hilang,dan React Query di client langsung bisa pakai data itu tanpa refetch. lempar data SSR -> client !!

// * ❗️prefetch di page.tsx hanya berjalan kalau halaman itu benar-benar diakses (dirender oleh server). dia tidak akan jalan otomatis di background sebelum user masuk ke page itu.

// * untuk data fetch SSR yg spesifik mengembalikan 1 buah data pakai => await queryClient.prefetchQuery

// * kalau data banyak pakai infiniteQuery !!! LIAT ADA PAKAI FLAG !!!
