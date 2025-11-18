// "use client"

import type { CategoriesType } from "@/types/sidebar/category/Type";
import TypeCategory from "../components/TypeCategory";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { CATEGORY } from "@/config/api/sidebar/discover/category/api";

// const LazyDescription = dynamic(() => import("./Description"), {
//   loading: () => <p>Loading…</p>,
// });

import CategoryList from "./List";

interface PageType {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ id?: string }>;
}

const page = async ({ params, searchParams }: PageType) => {
  // const cookieHeader = (await cookies()).toString();

  const path = (await params).type;
  const searchP = (await searchParams).id;

  // // * SSR HARUS GINI ?!
  // const res = await fetch(URL, {
  //   headers: {
  //     Cookie: cookieHeader, // forward cookie user
  //   },
  //   next: { revalidate: 60 * 2 },
  // });

  // const data = await res.json();
  // console.log(data);

  return (
    <>
      {path && <CategoryList params={path} />}
      {/* {searchP && <LazyDescription params={path} searchParams={searchP} />} */}
    </>
  );
};

export default page;

// todo hybrid => SSR PAGE INI, tapi data cachenya udah ada

// todo KALAU DI TIAP PATH ITU BANYAK REQUEST, JANGAN BUAT CUMA 1 ROUTER HANDLER, BUAT DI TIAP PATH APINYA MASING" !!! KALAU CUMA 1 NNTI REPORT MISAHINNYA !!!
// ! BANGUN ROUTE PATH DI CONFIG !!!
// TODO PREFETCH => LEMPAR (KEY PARAMS) SEBELUM DI CLICK !!!
