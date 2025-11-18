"use client";

import React, { memo, useCallback, useContext } from "react";
import ItemsList from "./items-list";
import { creatorContext } from "@/app/context";
import { IoMdOpen } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

export interface FolderListToggle {
  open: boolean;
  folder: string;
}

const FolderList = () => {
  const { listFolderData, openFolder, setOpenFolder } =
    useContext(creatorContext);
  const handleAction = useCallback(
    (actionType: string, folderName: string) => {
      switch (actionType) {
        case "open": {
          setOpenFolder({
            isOpen: true,
            isFolder: folderName,
          });
          break;
        }
        case "close": {
          setOpenFolder({
            isOpen: false,
            isFolder: "",
          });
          break;
        }
      }
    },
    [setOpenFolder]
  );

  return (
    <div className="w-[100%] flex">
      <div className="w-[6%] flex flex-start">
        <h1>Filter here</h1>
      </div>
      <div className="flex flex-col gap-4 w-[94%]">
        {Array.isArray(listFolderData) &&
          listFolderData.length > 0 &&
          listFolderData.map((f) => (
            <div
              key={f.folderName}
              className="group w-full p-4 rounded-2xl shadow-sm hover:shadow-md bg-white/70 backdrop-blur-sm transition-all border border-transparent hover:border-gray-200 text-left"
            >
              <div className="flex flex-col">
                <div className="flex justify-center items-center gap-3">
                  <div className="w-12 h-12 flex-center rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-6 h-6 text-indigo-600"
                    >
                      <path
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.75a1 1 0 0 1 .8.4l1 1.333A1 1 0 0 0 12.56 7H18.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 flex gap-4 min-w-0">
                    <h1 className="text-sm font-medium truncate">
                      {f.folderName}
                    </h1>
                    <h1 className="text-sm font-medium truncate">
                      {f.totalProduct}
                    </h1>
                  </div>
                  {openFolder.isOpen && openFolder.isFolder === f.folderName ? (
                    <button onClick={() => handleAction("close", "")}>
                      <IoMdClose />
                    </button>
                  ) : (
                    <button onClick={() => handleAction("open", f.folderName)}>
                      <IoMdOpen />
                    </button>
                  )}
                </div>
                {openFolder.isFolder === f.folderName && (
                  <ItemsList folderName={f.folderName} />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default memo(FolderList);
