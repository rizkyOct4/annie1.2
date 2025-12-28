"use client";

import React, {
  useRef,
  useContext,
  useEffect,
  useState,
  useCallback,
  memo
} from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { creatorsContext } from "@/app/context";
import { BiDislike, BiLike } from "react-icons/bi";
import { RandomId, LocalISOTime } from "@/_util/GenerateData";
import { PostDataLike } from "./type";
import { useRouter } from "next/navigation";

const ListProducts = ({ creatorId }: { creatorId: string }) => {
  const {
    listCreatorProductData,
    fetchNextPageProduct,
    hasNextPageProduct,
    isFetchingNextPageProduct,
    postLikePhoto,
  } = useContext(creatorsContext);

  const router = useRouter();

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
    if (inView && hasNextPageProduct && !isFetchingNextPageProduct)
      fetchNextPageProduct();
    setRoot(containerRef.current);
  }, [
    inView,
    fetchNextPageProduct,
    hasNextPageProduct,
    isFetchingNextPageProduct,
  ]);

  const handleAction = useCallback(
    async (
      e: React.SyntheticEvent,
      actionType: string,
      iuProduct: number,
      status: boolean
    ) => {
      e.preventDefault();
      switch (actionType) {
        case "likePost": {
          if (status) return;
          try {
            const postData: PostDataLike = {
              iu_vote: RandomId(),
              tar_iu_receiver: creatorId,
              tar_iu_product: iuProduct,
              like: 1,
              status: true,
              created_at: LocalISOTime(),
            };
            console.log(postData);
            await postLikePhoto(postData);
          } catch (err: any) {
            if (err.status === 401) {
              router.push("/auth");
            } else {
              console.error(err);
            }
          }
          break;
        }
      }
    },
    [creatorId, postLikePhoto, router]
  );

  return (
    <div
      ref={containerRef}
      className="
    w-full
    flex-center
    flex-wrap
    gap-4
    rounded-md
  ">
      {Array.isArray(listCreatorProductData) &&
        listCreatorProductData.map((i, idx) => {
          const isLast = idx === listCreatorProductData.length - 1;
          return (
            <div
              key={i.idProduct}
              ref={isLast ? lastItemRef : null}
              className="
            relative
            flex
            flex-col
            w-[30%]
            h-90
            overflow-hidden
            rounded-xl
            bg-black/80
            border border-white/10
            backdrop-blur-sm
          ">
              {/* Image section */}
              <div className="relative w-full min-h-56">
                <Image
                  src={i.url}
                  alt={i.description}
                  fill
                  sizes="(max-width: 240px) 100vw"
                  className="object-cover"
                />

                {/* Like button */}
                <button
                  type="submit"
                  onClick={(e) =>
                    handleAction(e, "likePost", i.iuProduct, i.status)
                  }
                  className="
                absolute
                top-3
                right-3
                w-9
                h-9
                flex
                items-center
                justify-center
                rounded-full
                bg-white/10
                border border-white/20
                backdrop-blur-sm
              ">
                  <BiLike
                    size={20}
                    className={i.status ? "text-red-500" : "text-blue-500"}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-2">
                {/* Description */}
                <h1 className="text-sm text-gray-300 line-clamp-3">
                  {i.description}
                </h1>

                {/* Category & hashtag */}
                <div className="flex flex-wrap gap-1">
                  {i.category.map((cat: string) => (
                    <span
                      key={cat}
                      className="
                    px-2
                    py-0.5
                    text-[11px]
                    font-medium
                    rounded-md
                    bg-white/10
                    text-gray-300
                    border border-white/10
                  ">
                      {cat}
                    </span>
                  ))}

                  {i.hashtag.map((tag: string) => (
                    <span
                      key={tag}
                      className="
                    px-2
                    py-0.5
                    text-[11px]
                    font-medium
                    rounded-md
                    bg-white/5
                    text-gray-400
                    border border-white/10
                  ">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="text-blue-500">
                        <BiLike />
                      </span>
                      {i.totalLike ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-gray-500">
                        <BiDislike />
                      </span>
                      {i.totalDislike ?? 0}
                    </span>
                  </div>
                  <span>{new Date(i.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}

      {/* Loading */}
      {isFetchingNextPageProduct && (
        <div className="w-full flex justify-center py-4 text-gray-400">
          <span>Loading more products...</span>
        </div>
      )}
    </div>
  );
};

export default memo(ListProducts);
