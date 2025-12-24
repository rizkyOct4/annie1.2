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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">
      {/* === EXPANDED MENU === */}
      <div
        className={`
      flex items-center gap-3
      transition-all duration-300 ease-out
      ${
        isRender.open
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-6 scale-95 pointer-events-none"
      }
    `}>
        <button
          onClick={() => handleAction("Ov", "video")}
          className="
        flex items-center gap-2
        px-4 py-2
        rounded-xl
        bg-black/80 backdrop-blur-md
        border border-white/20
        text-white text-sm font-medium
        shadow-lg
        hover:bg-black
        transition
        whitespace-nowrap
      ">
          <Video size={18} />
          Video
        </button>

        <button
          onClick={() => handleAction("Op", "photo")}
          className="
        flex items-center gap-2
        px-4 py-2
        rounded-xl
        bg-black/80 backdrop-blur-md
        border border-white/20
        text-white text-sm font-medium
        shadow-lg
        hover:bg-black
        transition
        whitespace-nowrap
      ">
          <ImageIcon size={18} />
          Photo
        </button>
      </div>

      {/* === MAIN FAB === */}
      <button
        onClick={() => handleAction("toggle", "")}
        className={`
      w-14 h-14
      rounded-full
      flex items-center justify-center
      shadow-xl
      transition-all duration-300
      ${isRender.open ? "bg-red-600 rotate-45" : "bg-black/80 hover:bg-black"}
    `}>
        <Plus size={26} className="text-white" />
      </button>
    </div>
  );
};

export default memo(PostingBtn);
