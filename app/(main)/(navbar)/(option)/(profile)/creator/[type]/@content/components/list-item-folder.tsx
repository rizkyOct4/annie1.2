"use client";

import React, { memo, useCallback, useContext, useState } from "react";
import { creatorContext } from "@/app/context";
import { ChartSpline, ChevronDown } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";

import ItemsList from "./items-list";
import { TListItemFolderPhoto } from "../../types/content/type";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import PutFolderNameForm from "../../form/photo/put-name-folder-form";

const LazyUpdatePhotoForm = dynamic(
  () => import("../../form/photo/put-photo-form"),
  {
    loading: () => <Loading />,
  }
);
// const LazyPutFolderNameForm = dynamic(
//   () => import("../../form/photo/put-name-folder-form"),
//   {
//     loading: () => <Loading />,
//   }
// );

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

const ListItemPhoto = ({
  data,
  currentPath,
}: {
  data: TListItemFolderPhoto[];
  currentPath: string;
}) => {
  const {
    stateFolder,
    setStateFolder,
    itemFolderPhotoData,
    isSort,
    sortItemFolder,
  } = useContext(creatorContext);
  const router = useRouter();

  const [isRender, setIsRender] = useState<IsRenderComponent>({
    isOpen: false,
    idProduct: null,
    value: "",
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
          router.push(
            `/creator/${currentPath}/stats?folder-name=${folderName}`
          );
          // router.push(
          //   `/creator/${currentPath}/stats?folder-name=${folderName}`
          // );
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
    [setStateFolder, router, currentPath, setNewNamefolder]
  );

  const renderComponent = useCallback(() => {
    switch (isRender.value) {
      case "update": {
        return <LazyUpdatePhotoForm setIsRender={setIsRender} />;
      }
    }
  }, [isRender]);

  return (
    <>
      <div className="w-full flex pl-4">
        <div className="flex flex-col gap-2 w-full">
          {Array.isArray(data) &&
            data.length > 0 &&
            data.map((f) => (
              <div
                key={f.folderName}
                className="w-full p-3 rounded-lg border border-white/10 bg-white/10 hover:bg-white/20 transition-colors">
                <>
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-9 h-9 flex-center rounded-md border border-white/30">
                      <button
                        type="button"
                        onClick={(e) =>
                          handleAction(e, "updateFolder", f.folderName)
                        }
                        title="Change Foldername"
                        className="text-white hover:text-blue-500 transition-colors cursor-pointer">
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

                    {/* Text */}
                    <div className="flex-1 w-9 h-9 flex items-center gap-2">
                      {newNameFolder.open &&
                      newNameFolder.targetFolder === f.folderName ? (
                        <PutFolderNameForm currentFoldername={f.folderName} />
                      ) : (
                        <span className="text-sm font-medium text-white truncate">
                          {f.folderName}
                        </span>
                      )}

                      <span className="text-sm font-medium text-white px-2 py-1 rounded border border-white/30">
                        {f.amountItem}
                      </span>
                    </div>

                    {/* Toggle Button */}
                    <div className="flex rounded-md border bg-white/20 border-white/30 overflow-hidden">
                      {listBtn.map((btn) => (
                        <button
                          key={btn.value}
                          onClick={(e) =>
                            handleAction(e, btn.value, f.folderName || "")
                          }
                          className={`
                            flex items-center px-4 py-2 text-white text-sm font-medium
                            transition-all duration-200 ease-in-out gap-2
                            ${
                              btn.value === "toggle" &&
                              stateFolder.isOpen &&
                              stateFolder.isFolder === f.folderName
                                ? "rotate-180"
                                : "rotate-0"
                            }
                            hover:bg-white/10 focus:bg-white/10 focus:outline-none
                          `}
                          title={btn.name}>
                          <span className="flex-center">{btn.icon}</span>
                          {btn.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {stateFolder.isFolder === f.folderName && (
                    <ItemsList
                      data={isSort ? sortItemFolder : itemFolderPhotoData}
                      folderName={f.folderName}
                      setIsRender={setIsRender}
                    />
                  )}
                </>
              </div>
            ))}
        </div>
      </div>
      {renderComponent()}
    </>
  );
};

export default memo(ListItemPhoto);
