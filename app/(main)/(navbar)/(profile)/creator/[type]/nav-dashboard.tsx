"use client";

import { useRouter, usePathname } from "next/navigation";
import { memo, useCallback, useContext, useState } from "react";
import dynamic from "next/dynamic";
import { Plus, Video, Image as ImageIcon } from "lucide-react";
import { creatorContext } from "@/app/context";
import { ToggleStateType } from "./type/interface";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ROUTES_PROFILE } from "@/app/(main)/(navbar)/(profile)/creator/[type]/config";

const LazyPostPhotoForm = dynamic(
  () => import("./Form/photo/post-form-photo"),
  {
    loading: () => <p>Loading…</p>,
  }
);
const LazyPostVideoForm = dynamic(
  () => import("./Form/video/post-form-video"),
  {
    loading: () => <p>Loading…</p>,
  }
);

const typeBtn = ["photo", "video"];

export const Dashboard = () => {
  const { publicId, setTypeBtn } = useContext(creatorContext);

  const [isOpen, setIsOpen] = useState({
    open: false,
    type: "",
  });

  const queryClient = useQueryClient();

  const handleAction = useCallback(
    (actionType: string, value: "video" | "photo" | "") => {
      switch (actionType) {
        case "Ov":
        case "Op": {
          setIsOpen({
            open: true,
            type: value,
          });
          break;
        }
        case "enter":
        case "leave": {
          setIsOpen((prev: ToggleStateType) => ({
            open: prev.open ? false : true,
            type: prev.type ? prev.type : "",
          }));
          break;
        }
      }
    },
    []
  );

  const router = useRouter();
  const currentPath = usePathname().replace("/creator/", "");

  const handlePrefetch = useCallback(
    async (typeBtn: string) => {
      if (!typeBtn) return;
      import("./Form/photo/post-form-photo");
      const queryKey = ["listFolderPost", publicId, typeBtn];
      setTypeBtn(typeBtn);
      if (!queryClient.getQueryData(queryKey)) {
        // Belum ada, buat prefetch baru
        const url = ROUTES_PROFILE.GET_BTN({ key: typeBtn });
        await queryClient.prefetchQuery({
          queryKey,
          queryFn: async () => {
            const { data } = await axios.get(url, {
              params: { typeBtn: typeBtn },
            });
            return data;
          },
        });
      }
    },
    [publicId, queryClient, setTypeBtn]
  );

  return (
    <>
      <div className="relative w-full bg-gradient-to-r from-blue-500 to-indigo-600 h-[60px] flex rounded-xl shadow-lg mb-4">
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex w-[30%] p-4 gap-4">
            {typeBtn.map((i, idx) => (
              <button
                key={idx}
                className={`${
                  currentPath === i ? "bg-gray-800" : "bg-blue-600"
                } text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:bg-blue-700 active:scale-95`}
                onClick={() => {
                  router.push(`/creator/${i}`);
                }}
              >
                {i}
              </button>
            ))}
          </div>

          <div
            onMouseEnter={() => handleAction("enter", "")}
            onMouseLeave={() => handleAction("leave", "")}
            className="relative flex justify-end items-center gap-4"
          >
            <div
              className={`flex items-center gap-3 transition-all duration-300 ${
                isOpen.open
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8 pointer-events-none"
              }`}
            >
              <button
                onMouseEnter={() => handlePrefetch("video")}
                onClick={() => handleAction("Ov", "video")}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 shadow-md transition-all duration-300"
              >
                <Video size={20} />
                Video
              </button>

              <button
                onMouseEnter={() => handlePrefetch("photo")}
                onClick={() => handleAction("Op", "photo")}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-500 shadow-md transition-all duration-300"
              >
                <ImageIcon size={20} />
                Photo
              </button>
            </div>

            <div
              className={`w-[50px] h-[50px] flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
                isOpen.open
                  ? "bg-red-600 rotate-45"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <Plus size={24} />
            </div>
          </div>
        </div>
      </div>

      {isOpen.type &&
        (isOpen.type === "video" ? (
          <LazyPostVideoForm setIsOpen={setIsOpen} />
        ) : (
          <LazyPostPhotoForm setIsOpen={setIsOpen} />
        ))}
    </>
  );
};

export default memo(Dashboard);
