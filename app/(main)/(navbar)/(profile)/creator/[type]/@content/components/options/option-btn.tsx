"use client";
import { FolderClock, ArrowUp01, RefreshCcw} from "lucide-react";
import { useEffect, useState } from "react";
import { MdDriveFileMove, MdDelete } from "react-icons/md";

const OptionBtn = ({
  isOpenNav,
  setIsOpenNav,
}: {
  isOpenNav: any;
  setIsOpenNav: any;
}) => {
  // Dummy folder list
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

  const handleSubmit = (e: any) => {
    e.preventDefault(); // prevent form refresh
    // console.log("Move to:", folderName, "Option:", selectedOption);
    // setFolderName("");
    // setSelectedOption("");
    // setShowInput(false);
    console.log(isOpenNav);
    setIsOpenNav({
      isOpen: true,
      iuProduct: [],
      type: "",
      targetFolder: "",
    });
  };

  return (
    <div className="flex gap-2 mt-4 z-50 full">
      {/* Move Button */}
      {listBtn.map((i, idx) => (
        <div
          key={idx}
          className={`border-b-2 ${
            isOpenNav.type === i.value
              ? "border-b-black"
              : "border-b-transparent"
          } font-medium w-auto flex flex-col`}
        >
          <button
            onClick={() =>
              setIsOpenNav((prev: any) => ({
                ...prev,
                iuProduct: [],
                type: prev.type === i.value ? "" : i.value,
              }))
            }
            className="flex items-center gap-2 px-4 py-2 h-12 text-black"
          >
            {i.icon}
            {i.name}
          </button>

          {isOpenNav.type === i.value && (
            <form
              onSubmit={handleSubmit}
              className="flex-center gap-2 flex-1 overflow-hidden"
            >
              <div className="border rounded-md px-2.5">
                <h4>{isOpenNav.iuProduct.length}</h4>
              </div>

              {isOpenNav.type === "move" && (
                <select
                  value={isOpenNav.targetFolder}
                  onChange={(e) =>
                    setIsOpenNav((prev: any) => ({
                      ...prev,
                      targetFolder: e.target.value,
                    }))
                  }
                  className="px-3 py-2"
                >
                  <option value="">Select folder</option>
                  {dummyFolders.map((folder, idx) => (
                    <option key={idx} value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="px-4 py-2 bg-amber-400 text-white hover:bg-amber-500 transition-colors"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
};

export default OptionBtn;
