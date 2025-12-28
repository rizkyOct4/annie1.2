"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import OptionBtn from "./options/option-btn";
import { MdCheck, MdClose } from "react-icons/md";

export type VideoItem = {
  idProduct: number;
  url: string;
  thumbnailUrl: string;
  duration?: number;
  folderName: string;
};

export interface ItemListStateNav {
  isOpen: boolean;
  idProduct: number[];
  type: string;
  targetFolder: string;
  prevFolder: string;
}

type VideoActionType = "play" | "share" | "delete" | "navAction";

const VideoCard = ({
  data,
  folderName,
  setIsRender,
}: {
  data: VideoItem[];
  folderName: string;
  setIsRender: any;
}) => {
  // console.log(`video data:`, data);

  // ? Navigation State
  const [isOpenNav, setIsOpenNav] = useState<ItemListStateNav>({
    isOpen: true,
    idProduct: [],
    type: "",
    targetFolder: "",
    prevFolder: folderName,
  });

  const handleAction = useCallback(
    (action: VideoActionType, item: VideoItem) => {
      switch (action) {
        case "navAction": {
          setIsOpenNav((prev: any) => ({
            ...prev,
            idProduct: prev.idProduct.includes(item.idProduct)
              ? prev.idProduct.filter((f: number) => f !== item.idProduct)
              : [...prev.idProduct, item.idProduct],
          }));
          break;
        }

        case "play":
          setIsRender({
            isOpen: true,
            idProduct: item.idProduct,
            value: "video",
            url: item.url,
            thumbnailUrl: item.thumbnailUrl,
          });
          break;

        case "share":
          navigator.clipboard.writeText(item.url);
          alert("Video link copied!");
          break;

        case "delete":
          console.log("DELETE VIDEO:", item.idProduct);
          break;

        default:
          break;
      }
    },
    [setIsRender]
  );

  return (
    <>
      {isOpenNav && (
        <OptionBtn isOpenNav={isOpenNav} setIsOpenNav={setIsOpenNav} />
      )}
      {Array.isArray(data) &&
        data.map((i) => (
          <div
            key={i.idProduct}
            className="
              relative
              flex flex-col
              w-[22%]
              min-w-55
              rounded-2xl
              overflow-hidden
              bg-white/5
              border border-white/10
              hover:border-white/20
              transition
              group
            ">
            {/* ===== THUMBNAIL ===== */}
            <div className="relative w-full aspect-3/4 overflow-hidden">
              <Image
                src={i.thumbnailUrl}
                alt="Video thumbnail"
                fill
                sizes="(max-width: 200px) 100vw"
                className="
                  object-cover
                  transition-transform duration-300
                  group-hover:scale-[1.03]
                "
              />

              {/* ===== DURATION BADGE ===== */}
              {i.duration && (
                <div
                  className="
                    absolute bottom-3 right-3
                    rounded-md
                    bg-black/70
                    px-2 py-1
                    text-xs text-white
                    backdrop-blur-sm
                  ">
                  {Math.floor(i.duration)}s
                </div>
              )}

              {/* ===== OVERLAY ACTIONS ===== */}
              {["move", "delete"].includes(isOpenNav.type) && (
                <button
                  onClick={() => handleAction("navAction", i)}
                  className={`absolute top-3 left-3
                                w-9 h-9
                                rounded-xl
                                flex items-center justify-center
                                transition
                                backdrop-blur-sm
                                ${
                                  isOpenNav?.idProduct.includes(i.idProduct)
                                    ? "bg-black/70 text-white"
                                    : "bg-white/80 text-gray-700 hover:bg-white"
                                }
                              `}>
                  {isOpenNav?.idProduct.includes(i.idProduct) ? (
                    <MdCheck size={18} />
                  ) : (
                    <MdClose size={18} />
                  )}
                </button>
              )}
              <div
                className="
                  absolute bottom-3 left-0 right-0
                  flex items-center gap-2
                  px-4
                  opacity-0 translate-y-2
                  group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-200 ease-out
                ">
                {/* PLAY */}
                <button
                  onClick={() => handleAction("play", i)}
                  className="
                    w-9 h-9
                    rounded-lg
                    bg-white/80
                    backdrop-blur-sm
                    border border-gray-200
                    text-gray-700
                    flex items-center justify-center
                    hover:bg-white
                    hover:shadow-sm
                    transition
                  ">
                  ▶
                </button>

                {/* SHARE */}
                <button
                  onClick={() => handleAction("share", i)}
                  className="
                    w-9 h-9
                    rounded-lg
                    bg-white/80
                    backdrop-blur-sm
                    border border-gray-200
                    text-gray-700
                    flex items-center justify-center
                    hover:bg-white
                    hover:shadow-sm
                    transition
                  ">
                  ⤴
                </button>

                {/* DELETE */}
                <button
                  onClick={() => handleAction("delete", i)}
                  className="
                    w-9 h-9
                    rounded-lg
                    bg-white/80
                    backdrop-blur-sm
                    border border-gray-200
                    text-gray-700
                    flex items-center justify-center
                    hover:bg-white
                    hover:text-red-600
                    hover:shadow-sm
                    transition
                  ">
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default VideoCard;
