"use client";

import React, {  useCallback, useContext, useState } from "react";
import { creatorContext } from "@/app/context";
import { ChartSpline, ChevronDown } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { TListItemFolder } from "../../types/content/type";
import Loading from "@/app/(main)/loading";
import PutFolderNameForm from "../../form/photo/put-name-folder-form";
import PutPhotoForm from "../../form/photo/put-photo-form";
import PhotoCard from "./photo-card";
import VideoCard from "./video-card";
import VideoPlayerModal from "./video/video-player";


export interface FolderListToggle {
  open: boolean;
  folder: string;
}

export interface IsRenderComponent {
  isOpen: boolean;
  idProduct: number | null;
  value: string;
}

const listBtn = [
  { name: `Delete`, icon: <MdDelete size={18} />, value: "delete" },
  {
    name: `Stats`,
    icon: <ChartSpline size={18} />,
    value: "stats",
  },
  {
    name: "",
    icon: <ChevronDown size={18} />,
    value: "toggle",
  },
];

const ListItem = ({
  data,
  currentPath,
}: {
  data: TListItemFolder[];
  currentPath: string;
}) => {
  const {
    stateFolder,
    setStateFolder,
    isFetchingListItemFolder,
    isFetchingListItemFolderVideo,
    itemFolderPhotoData,
    ItemsVideoData,
    isSort,
    sortItemFolder,
  } = useContext(creatorContext);

  const [isRender, setIsRender] = useState<any>({
    isOpen: false,
    idProduct: null,
    value: "",
    url: "",
    thumbnailUrl: ""
  });

  const [newNameFolder, setNewNamefolder] = useState({
    open: false,
    targetFolder: "",
  });

  const handleAction = useCallback(
    (e: React.SyntheticEvent, actionType: string, folderName: string) => {
      e.preventDefault();
      switch (actionType) {
        case "toggle": {
          setStateFolder((prev: { isFolder: string }) => ({
            ...prev,
            isOpen: prev.isFolder === folderName ? false : true,
            isFolder: prev.isFolder === folderName ? "" : folderName,
          }));
          break;
        }
        case "stats": {
          const newUrl = `/creator/${currentPath}/stats?folder-name=${folderName}`;
          history.pushState({}, "", newUrl);
          break;
        }
        case "updateFolder": {
          setNewNamefolder((prev: { open: boolean; targetFolder: string }) => ({
            open: prev.targetFolder === folderName ? false : true,
            targetFolder: prev.targetFolder === folderName ? "" : folderName,
          }));
          break;
        }
      }
    },
    [setStateFolder, currentPath, setNewNamefolder]
  );

  const renderComponent = useCallback(() => {
    switch (isRender.value) {
      case "update": {
        return <PutPhotoForm setIsRender={setIsRender} />;
      }
      case "video": {
        return <VideoPlayerModal data={isRender} setIsRender={setIsRender} />;
      }
    }
  }, [isRender]);

  return (
    <>
      <div className="w-full flex px-4 relative">
        <div className="flex flex-col gap-3 w-full">
          {isFetchingListItemFolder | isFetchingListItemFolderVideo ? (
            <Loading />
          ) : (
            Array.isArray(data) &&
            data.length > 0 &&
            data.map((f, idx) => (
              <div
                key={idx}
                className={`
                w-full p-4 rounded-xl
                border ${stateFolder.isFolder === f.folderName ? 'border-emerald-500 bg-black/40 backdrop-blur-md' : 'border-white/10 bg-white/5'}
                transition
                `}>
                <>
                  {/* ===== HEADER ===== */}
                  <div className="flex items-center gap-4">
                    {/* Icon / Edit */}
                    <div
                      className="
                      w-10 h-10
                      flex items-center justify-center
                      rounded-lg
                      bg-white/10
                      border border-white/20
                    ">
                      <button
                        type="button"
                        onClick={(e) =>
                          handleAction(e, "updateFolder", f.folderName)
                        }
                        title="Change Foldername"
                        className="
                        text-gray-300
                        hover:text-emerald-400
                        transition
                      ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="w-5 h-5">
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.75a1 1 0 0 1 .8.4l1 1.333A1 1 0 0 0 12.56 7H18.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Folder Name & Count */}
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      {newNameFolder.open &&
                      newNameFolder.targetFolder === f.folderName ? (
                        <PutFolderNameForm currentFoldername={f.folderName} />
                      ) : (
                        <span className="text-sm font-medium text-gray-200 truncate">
                          {f.folderName}
                        </span>
                      )}

                      <span
                        className="
                        text-xs font-semibold
                        px-2 py-0.5
                        rounded-md
                        bg-white/10
                        border border-white/20
                        text-gray-300
                      ">
                        {f.amountItem}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className="
                      flex
                      rounded-lg
                      bg-white/5
                      border border-white/10
                      overflow-hidden
                    ">
                      {listBtn.map((btn) => (
                        <button
                          key={btn.value}
                          onClick={(e) =>
                            handleAction(e, btn.value, f.folderName || "")
                          }
                          className={`
                          flex items-center gap-2
                          px-4 py-2
                          text-sm font-medium
                          text-gray-300
                          transition
                          hover:bg-white/10 hover:text-gray-100
                          focus:outline-none
                          ${
                            btn.value === "toggle" &&
                            stateFolder.isOpen &&
                            stateFolder.isFolder === f.folderName
                              ? "rotate-180"
                              : ""
                          }
                        `}
                          title={btn.name}>
                          <span className="flex items-center">{btn.icon}</span>
                          {btn.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ===== ITEMS LIST ===== */}
                  {stateFolder.isFolder === f.folderName && (
                    <div className="flex flex-wrap justify-center gap-6 w-full max-h-120 overflow-y-auto mt-4 pl-4 border-l border-emerald-500">
                      {currentPath === "photo" ? (
                        <PhotoCard
                          data={isSort ? sortItemFolder : itemFolderPhotoData}
                          folderName={f.folderName}
                          setIsRender={setIsRender}
                        />
                      ) : (
                        <VideoCard
                          data={ItemsVideoData}
                          folderName={f.folderName}
                          setIsRender={setIsRender}
                        />
                      )}
                    </div>
                  )}
                </>
              </div>
            ))
          )}
        </div>
      </div>

      {renderComponent()}
    </>
  );
};

export default ListItem;
