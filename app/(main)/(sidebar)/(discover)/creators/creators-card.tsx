"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState, memo } from "react";
import { useRouter } from "next/navigation";
import { creatorsContext } from "@/app/context";
import { useInView } from "react-intersection-observer";

const CreatorsCard = ({ currentPath }: { currentPath: string }) => {
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
      className="
        flex-center
        flex-wrap
        gap-4
        p-4
        overflow-y-auto
        w-full
        h-screen
  ">
      {Array.isArray(listCreatorsData) && listCreatorsData.length > 0
        ? listCreatorsData.map((i, idx) => {
            const isLast = idx === listCreatorsData.length - 1;
            return (
              <div
                key={idx}
                ref={isLast ? lastItemRef : null}
                className="
              w-[20%] sm:w-72 md:w-64
              rounded-xl
              bg-white/5
              border border-white/10
              backdrop-blur-sm
              overflow-hidden
            ">
                {/* Image */}
                <div className="relative h-56">
                  <Image
                    width={160}
                    height={100}
                    src={i.picture || "/"}
                    alt="#"
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>

                {/* Content */}
                <div className="px-4 py-3">
                  <button
                    type="button"
                    className="
                  font-semibold
                  text-gray-200
                  cursor-pointer
                  block
                "
                    onClick={() => {
                      router.push(`/${currentPath}/${i.publicId}`);
                    }}>
                    {i.username}
                  </button>

                  <p className="text-sm text-gray-400">{i.username}</p>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default memo(CreatorsCard);
