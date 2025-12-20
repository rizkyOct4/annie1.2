"use client";

import { Plus, Video, Image as ImageIcon } from "lucide-react";
import { useCallback, useContext, memo } from "react";
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
  const { setTypeBtn } = useContext(creatorContext);

  const handleAction = useCallback(
    (actionType: string, value: "video" | "photo" | "") => {
      switch (actionType) {
        case "Ov":
        case "Op": {
          setIsRender({
            open: true,
            type: value,
          });
          setTypeBtn(value);
          break;
        }
        case "toggle": {
          setIsRender((prev: { open: boolean; type: string }) => ({
            open: prev.open ? false : true,
            type: prev.type ? prev.type : "",
          }));
          break;
        }
      }
    },
    [setIsRender, setTypeBtn]
  );
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
      {/* MENU BUTTONS */}
      <div
        className={`flex items-center gap-3 transition-all duration-200 ${
          isRender.open
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-4 pointer-events-none"
        }`}>
        <button
          onClick={() => handleAction("Ov", "video")}
          className="flex items-center gap-2 px-4 py-2 bg-black/80 text-white text-sm font-medium rounded-lg 
        border border-gray-300 transition cursor-pointer whitespace-nowrap">
          <Video size={18} />
          Video
        </button>

        <button
          onClick={() => handleAction("Op", "photo")}
          className="flex items-center gap-2 px-4 py-2 bg-black/80 text-white text-sm font-medium rounded-lg 
        border border-gray-300 transition cursor-pointer whitespace-nowrap">
          <ImageIcon size={18} />
          Photo
        </button>
      </div>

      {/* MAIN FAB BUTTON */}
      <button
        onClick={() => handleAction("toggle", "")}
        className={`w-13.75 h-13.75 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md
      ${
        isRender.open ? "bg-red-600 rotate-45" : "bg-black/80 hover:bg-gray-800"
      }`}>
        <Plus size={26} className="text-white" />
      </button>
    </div>
  );
};

export default memo(PostingBtn);
