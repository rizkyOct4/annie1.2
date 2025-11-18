import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ISGQuery, SSRInfiniteQuery } from "@/_util/fetch";
import { ROUTES_CREATORS } from "@/app/(main)/(sidebar)/(discover)/creators/config";
import Fetching from "@/_util/fetch";
import ModalPopup from "./modal-creators";

const page = async ({
  params,
}: // searchParams,
{
  params: Promise<{ publicId: string }>;
  // searchParams: Promise<{ searchParams: string }>;
}) => {
  const path = (await params).publicId;
  const { queryClient, publicId } = await Fetching();

  // ! TIAP QUERYCLIENT KAU INI -> WADAH UNTUK ISG, SSR, ETC, JANGAN BUAT WADAH BARU DI FUNGSI LAINNYA , CUKUP LEMPAR DARI SINI AGAR TAU !!
  // * DESCRIPTION USERS
  const ISGconfig = ROUTES_CREATORS.GET({
    typeConfig: "creatorsDescription",
    publicId: path,
  });
  const queryKey = ["keyCreatorDescription", publicId, path];
  await ISGQuery({
    queryKey: queryKey,
    config: ISGconfig,
    queryClient: queryClient,
  });

  // * LIST PRODUCT USERS
  const queryKeyList = ["keyListProductCreators", publicId, path];
  await SSRInfiniteQuery({
    queryKey: queryKeyList,
    config: ROUTES_CREATORS.GET,
    typeConfig: "listCreatorsProduct",
    path: path,
    queryClient: queryClient,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ModalPopup />
    </HydrationBoundary>
  );
};

export default page;
