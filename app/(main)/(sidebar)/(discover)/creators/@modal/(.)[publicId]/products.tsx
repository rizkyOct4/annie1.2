"use client";

import React, {
  useRef,
  useContext,
  useEffect,
  useState,
  useCallback,
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
      className="overflow-y-auto w-full flex flex-wrap gap-4 justify-start rounded-md"
    >
      {Array.isArray(listCreatorProductData) &&
        listCreatorProductData.map((i, idx) => {
          const isLast = idx === listCreatorProductData.length - 1;
          return (
            <div
              key={i.iuProduct}
              ref={isLast ? lastItemRef : null}
              className="relative flex flex-col bg-white rounded-xl shadow-sm w-[30%] h-[300px] overflow-hidden"
            >
              {/* Image section */}
              <div className="relative w-full min-h-[200px] group">
                <Image
                  src={i.url}
                  alt={i.description}
                  fill
                  className="object-cover transition-transform"
                />

                {/* Like button */}
                <button
                  type="submit"
                  onClick={(e) =>
                    handleAction(e, "likePost", i.iuProduct, i.status)
                  }
                  className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-white/40 hover:scale-110 hover:shadow-lg hover:bg-white transition-all duration-300"
                >
                  <BiLike
                    className={`${
                      i.status ? "text-red-600" : "text-blue-600"
                    }  transition-transform duration-300 `}
                    size={22}
                  />
                </button>
              </div>

              {/* Description */}
              <div className="h-auto p-4 flex flex-col justify-between overflow-y-auto">
                {/* Deskripsi */}
                <p className="text-sm">{i.description}</p>

                {/* Kategori & hashtag */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {i.category.map((cat: string) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-600 
                     border border-blue-100 rounded-md"
                    >
                      {cat}
                    </span>
                  ))}

                  {i.hashtag.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 
                     border border-gray-200 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Like / Dislike / Tanggal */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="text-blue-600">
                        <BiLike />
                      </span>{" "}
                      {i.totalLike ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-gray-400">
                        <BiDislike />
                      </span>{" "}
                      {i.totalDislike ?? 0}
                    </span>
                  </div>
                  <span>{new Date(i.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          );
        })}

      {/* Loading indicator */}
      {isFetchingNextPageProduct && (
        <div className="w-full flex justify-center py-4 text-gray-500">
          <span className="animate-pulse">Loading more products...</span>
        </div>
      )}
    </div>
  );
};

export default ListProducts;
