"use client";

import { Plus, Video, Image as ImageIcon } from "lucide-react";
import { useCallback, useContext, useEffect, memo } from "react";
import { IDashboard } from "../type/dashboard/interface";
import { creatorContext } from "@/app/context";

const PostingBtn = ({
  currentPath,
  isRender,
  setIsRender,
}: {
  currentPath: string;
  isRender: IDashboard;
  setIsRender: React.Dispatch<React.SetStateAction<IDashboard>>;
}) => {
  const { publicId, setTypeBtn } = useContext(creatorContext);

  const handleAction = useCallback(
    (actionType: string, value: "video" | "photo" | "") => {
      switch (actionType) {
        case "Ov":
        case "Op": {
          setIsRender({
            open: true,
            type: value,
          });
          break;
        }
        case "toggle": {
          setIsRender((prev) => ({
            open: prev.open ? false : true,
            type: prev.type ? prev.type : "",
          }));
          break;
        }
      }
    },
    [setIsRender]
  );
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
      {/* MENU BUTTONS */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-200 ${
          isRender.open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={() => handleAction("Ov", "video")}
          className="flex items-center gap-2 px-4 py-2 bg-black/80 text-white text-sm font-medium rounded-lg 
             border border-gray-300 transition cursor-pointer"
        >
          <Video size={18} />
          Video
        </button>

        <button
          onClick={() => handleAction("Op", "photo")}
          className="flex items-center gap-2 px-4 py-2 bg-black/80 text-white text-sm font-medium rounded-lg 
             border border-gray-300 transition cursor-pointer"
        >
          <ImageIcon size={18} />
          Photo
        </button>
      </div>

      {/* MAIN FAB BUTTON */}
      <button
        onClick={() => handleAction("toggle", "")}
        className={`w-[55px] h-[55px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md
      ${
        isRender.open ? "bg-red-600 rotate-45" : "bg-black/80 hover:bg-gray-800"
      }`}
      >
        <Plus size={26} className="text-white" />
      </button>
    </div>
  );
};

export default memo(PostingBtn);
