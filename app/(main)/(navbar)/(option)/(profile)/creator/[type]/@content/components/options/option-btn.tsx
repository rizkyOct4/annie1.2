"use client";

import { creatorContext } from "@/app/context";
import { FolderClock, ArrowUp01, RefreshCcw } from "lucide-react";
import { useCallback, useContext } from "react";
import { MdDriveFileMove, MdDelete } from "react-icons/md";
import { ItemListStateNav } from "../photo-card";
import { showToast } from "@/_util/Toast";

export interface PutGroupedImage {
  idProduct: number[];
  targetFolder: string;
  prevFolder: string;
}
export interface DeleteGroupedImage {
  idProduct: number[];
  prevFolder: string;
}

const OptionBtn = ({
  isOpenNav,
  setIsOpenNav,
}: {
  isOpenNav: ItemListStateNav;
  setIsOpenNav: React.Dispatch<React.SetStateAction<ItemListStateNav>>;
}) => {
  const {
    setIsSort,
    refetchItemFolder,
    refetchItemsVideo,
    type,
    setTypeBtn,
    groupedPutPhoto,
    groupedDeletePhoto,
    ListPostFolderData,
  } = useContext(creatorContext);

  const listBtn = [
    { name: `Move`, icon: <MdDriveFileMove size={18} />, value: "move" },
    { name: `Delete`, icon: <MdDelete size={18} />, value: "delete" },
    { name: `History`, icon: <FolderClock size={18} />, value: "history" },
    { name: `Filter`, icon: <ArrowUp01 size={18} />, value: "filter" },
    { name: `Refresh`, icon: <RefreshCcw size={18} />, value: "refresh" },
  ];

  const handleAction = useCallback(
    (e: React.SyntheticEvent, actionType: string) => {
      e.preventDefault();
      switch (actionType) {
        case "move":
        case "delete": {
          if (actionType === "move") setTypeBtn(type);
          setIsOpenNav((prev) => ({
            ...prev,
            idProduct: [],
            type: prev.type === actionType ? "" : actionType,
          }));
          break;
        }
        case "filter": {
          setIsSort((prev: boolean) => !prev);
          break;
        }
        case "refresh": {
          if (type === "photo") {
            refetchItemFolder();
          } else {
            refetchItemsVideo();
          }
          break;
        }
      }
    },
    [
      setIsOpenNav,
      setTypeBtn,
      type,
      setIsSort,
      refetchItemFolder,
      refetchItemsVideo,
    ]
  );

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent, actionType: string) => {
      e.preventDefault();
      switch (actionType) {
        case "move": {
          try {
            const payload: PutGroupedImage = {
              idProduct: isOpenNav.idProduct,
              targetFolder: isOpenNav.targetFolder,
              prevFolder: isOpenNav.prevFolder,
            };
            const res = await groupedPutPhoto(payload);
            showToast({ type: "success", fallback: res.message });
            setIsOpenNav({
              isOpen: false,
              idProduct: [],
              type: "",
              targetFolder: "",
              prevFolder: "",
            });
          } catch (error) {
            console.error(error);
          }
          break;
        }
        case "delete":
          {
            try {
              if (!isOpenNav.idProduct.length) return;
              const payload: DeleteGroupedImage = {
                prevFolder: isOpenNav.prevFolder,
                idProduct: isOpenNav.idProduct,
              };
              const res = await groupedDeletePhoto(payload);
              showToast({ type: "success", fallback: res.message });
              setIsOpenNav({
                isOpen: false,
                idProduct: [],
                type: "",
                targetFolder: "",
                prevFolder: "",
              });

              console.log(payload);
            } catch (error) {
              console.error(error);
            }
          }
          break;
      }
    },
    [setIsOpenNav, isOpenNav, groupedPutPhoto, groupedDeletePhoto]
  );

  return (
    <div className="flex items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-3 w-full">
        {listBtn.map((i, idx) => (
          <button
            key={idx}
            title={i.name}
            onClick={(e) => handleAction(e, i.value)}
            className={`
              flex items-center gap-2
              px-4 py-2
              rounded-lg
              text-sm font-medium
              transition
              border
              ${
                isOpenNav.type === i.value
                  ? "bg-white/10 border-white/20 text-gray-200"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10"
              }
            `}>
            {i.icon}
          </button>
        ))}
      </div>
      <div>
        {["move", "delete"].includes(isOpenNav.type) && (
          <form
            onSubmit={(e) => handleSubmit(e, isOpenNav.type)}
            className="
            flex items-center gap-4
          ">
            {/* Counter */}
            <div
              className="
              min-w-11
              text-center
              px-3 py-1
              rounded-md
              bg-white/10
              border border-white/10
              text-sm text-gray-200
            ">
              {isOpenNav.idProduct.length}
            </div>

            {/* Select */}
            {isOpenNav.type === "move" && (
              <select
                value={isOpenNav.targetFolder}
                onChange={(e) =>
                  setIsOpenNav((prev) => ({
                    ...prev,
                    targetFolder: e.target.value,
                  }))
                }
                className="
                px-3 py-2
                rounded-md
                bg-white/10
                border border-white/10
                text-sm text-gray-200
                focus:outline-none focus:ring-1 focus:ring-emerald-500/50
              ">
                <option value="" disabled>
                  Choose folder
                </option>
                {Array.isArray(ListPostFolderData) &&
                  ListPostFolderData.map(
                    (i: { folderName: string }, idx: number) => (
                      <option
                        disabled={i.folderName === isOpenNav.prevFolder}
                        key={idx}
                        value={i.folderName}
                        className="text-black">
                        {i.folderName}
                      </option>
                    )
                  )}
              </select>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="
              px-4 py-2
              rounded-md
              bg-emerald-600/80
              hover:bg-emerald-600
              text-sm font-medium text-white
              transition
            ">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OptionBtn;
