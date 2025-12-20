"use client";

import { creatorContext } from "@/app/context";
import { FolderClock, ArrowUp01, RefreshCcw } from "lucide-react";
import { useCallback, useContext } from "react";
import { MdDriveFileMove, MdDelete } from "react-icons/md";

const OptionBtn = ({
  isOpenNav,
  setIsOpenNav,
}: {
  isOpenNav: any;
  setIsOpenNav: any;
}) => {
  const { setIsSort, isRefetchItemFolder } =
    useContext(creatorContext);
  // console.log(itemFolderPhotoData);

  // const sort = SortASC(itemFolderPhotoData);

  const dummyFolders = [
    "Folder A",
    "Folder B",
    "Folder C",
    "Folder D",
    "Folder E",
  ];
  const listBtn = [
    { name: `Move`, icon: <MdDriveFileMove size={20} />, value: "move" },
    { name: `Delete`, icon: <MdDelete size={20} />, value: "delete" },
    { name: `History`, icon: <FolderClock size={20} />, value: "history" },
    { name: `Filter`, icon: <ArrowUp01 size={20} />, value: "filter" },
    { name: `Refresh`, icon: <RefreshCcw size={20} />, value: "refresh" },
  ];

  const handleAction = useCallback(
    (e: React.SyntheticEvent, actionType: string) => {
      e.preventDefault();
      switch (actionType) {
        case "move":
        case "delete": {
          setIsOpenNav((prev: { type: string }) => ({
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
          isRefetchItemFolder();
          break;
        }
      }
    },
    [setIsOpenNav, setIsSort, isRefetchItemFolder]
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsOpenNav({
      isOpen: true,
      iuProduct: [],
      type: "",
      targetFolder: "",
    });
  };

  return (
    <div className="flex gap-3 mt-4 relative z-50">
      {listBtn.map((i, idx) => (
        <div key={idx} className="flex flex-col w-auto">
          {/* Button */}
          <button
            onClick={(e) => handleAction(e, i.value)}
            className={`
          flex items-center gap-2 px-4 py-2 rounded-md
          text-sm font-medium
          transition-colors
          border border-transparent
          ${
            isOpenNav.type === i.value
              ? "bg-white/10 border-white/20"
              : "text-white hover:bg-white/5 hover:border-white/30"
          }
        `}>
            {i.icon}
            <span>{i.name}</span>
          </button>
        </div>
      ))}

      {/* Dropdown */}
      {["move", "delete"].includes(isOpenNav.type) && (
        <form
          onSubmit={handleSubmit}
          className="absolute -top-15 right-40
        flex items-center gap-2
        bg-black/80 border border-white/10 rounded-md
        text-white p-2
        shadow-lg
        z-50
        w-auto
      ">
          {/* Counter */}
          <div className="border rounded-md px-3 py-1 text-sm">
            {isOpenNav.idProduct.length}
          </div>

          {/* Select folder */}
          {isOpenNav.type === "move" && (
            <select
              value={isOpenNav.targetFolder}
              onChange={(e) =>
                setIsOpenNav((prev: any) => ({
                  ...prev,
                  targetFolder: e.target.value,
                }))
              }
              className="
            px-3 py-2 rounded-md
            bg-white/10 border border-black/80
            text-sm text-white
            focus:outline-none focus:ring-1 focus:ring-white/30
          ">
              <option value="" className="text-black">
                Select folder
              </option>
              {dummyFolders.map((folder, idx) => (
                <option key={idx} value={folder} className="text-black">
                  {folder}
                </option>
              ))}
            </select>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="
          px-4 py-2 bg-white/10 hover:bg-white/20
          text-white rounded-md text-sm transition-colors
        ">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default OptionBtn;
