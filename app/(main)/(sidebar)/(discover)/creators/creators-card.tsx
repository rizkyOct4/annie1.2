"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { creatorsContext } from "@/app/context";
import { useInView } from "react-intersection-observer";

const CreatorsCard = ({ url }: { url: string }) => {
  const router = useRouter();
  const { listCreatorsData, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useContext(creatorsContext);

  // ? 🔹 ref untuk container scrollable
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ? 🔹 karena root belum ada saat render pertama, set setelah mount
  const [root, setRoot] = useState<Element | null>(null);

  // ? setup observer
  const { ref: lastItemRef, inView } = useInView({
    threshold: 0.2, // ! trigger ketika 20% elemen terlihat
    root,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    setRoot(containerRef.current);
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div
      ref={containerRef}
      className="flex-center flex-wrap gap-4 p-4 w-[100%] h-screen  overflow-y-auto"
    >
      {Array.isArray(listCreatorsData) && listCreatorsData.length > 0
        ? listCreatorsData.map((i, idx) => {
            const isLast = idx === listCreatorsData.length - 1;
            return (
              <div
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden w-[20%] sm:w-72 md:w-64"
                key={idx}
                ref={isLast ? lastItemRef : null}
              >
                <div className="relative h-[240px]">
                  <Image
                    width={160}
                    height={100}
                    src={i.picture || "/"}
                    alt="#"
                    className="object-cover"
                  />
                </div>
                <div className="pt-2 px-4 pb-4">
                  <button
                    className="font-semibold text-black cursor-pointer"
                    onClick={() => router.push(`/${url}/${i.publicId}`)}
                  >
                    {i.firstName} {i.lastName}
                  </button>
                  <p className="text-sm text-gray-500">{i.username}</p>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default CreatorsCard;

// todo besok kondisikan sama kau ini untuk scrool + hook + useRef
// todo ROUTE KAU BELUM PAS LAGI !!! KONDISIKAN LAGI SAMA KAU BESOK !! BUAT PERFCT!!
// todo INFINITEQUERY KAU kondisikan lagi !!! liat gimana di hook kau !!!
//todo OFFSET FILTER DATA DB !!!
