"use client";
import { FolderClock, ArrowUp01, RefreshCcw } from "lucide-react";
import { MdDriveFileMove, MdDelete } from "react-icons/md";

const OptionBtn = ({
  isOpenNav,
  setIsOpenNav,
}: {
  isOpenNav: any;
  setIsOpenNav: any;
}) => {
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
    e.preventDefault();
    setIsOpenNav({
      isOpen: true,
      iuProduct: [],
      type: "",
      targetFolder: "",
    });
  };

  return (
    <div className="flex gap-3 mt-4 z-50 relative">
      {listBtn.map((i, idx) => (
        <div key={idx} className="flex flex-col w-auto">
          {/* Button */}
          <button
            onClick={() =>
              setIsOpenNav((prev: any) => ({
                ...prev,
                iuProduct: [],
                type: prev.type === i.value ? "" : i.value,
              }))
            }
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md
              text-sm font-medium
              transition-colors
              border border-transparent
              ${
                isOpenNav.type === i.value
                  ? "bg-white/10 border-white/20"
                  : "text-gray-400 hover:bg-white/5"
              }
            `}
          >
            {i.icon}
            <span>{i.name}</span>
          </button>

          {/* Dropdown */}
          {isOpenNav.type === i.value && (
            <form
              onSubmit={handleSubmit}
              className="z-60 bg-black/80 absolute top-[-60px] flex items-center gap-2 border-white/10 rounded-md text-white p-2"
            >
              <div className="border rounded-md px-3 py-1 text-sm">
                {isOpenNav.iuProduct.length}
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
                  className="px-3 py-2 rounded-md bg-white/10 border border-black/80 text-sm  focus:outline-none focus:ring-1 focus:ring-white/30"
                >
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

              <button
                type="submit"
                className="px-4 py-2 bg-black/80 text-white rounded-md text-sm transition-colors"
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
