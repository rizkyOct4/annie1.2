"use client";

import { useContext } from "react";
import { creatorContext } from "@/app/context";
import { SLoading } from "@/_util/Spinner-loading";
import dynamic from "next/dynamic";

const LazyListListItemPhoto = dynamic(() => import("./list-item-folder"), {
  loading: () => <SLoading />,
});

export default function ModalListItem({
  currentPath,
}: {
  currentPath: string;
}) {
  const {
    listItemFolderPhotoData,
    // itemFolderVideoData,
  } = useContext(creatorContext);

  switch (currentPath) {
    case "photo":
      return (
        <LazyListListItemPhoto
          data={listItemFolderPhotoData}
          currentPath={currentPath}
        />
      );
    // case "video":
    //   return <ListItemPhoto data={itemFolderVideoData} />;
    default:
      return (
        <div className="w-full flex flex-col items-center justify-center py-10 bg-black/80 text-white rounded-xl border border-white/10 shadow-lg">
          <p className="text-lg font-medium">No items found</p>
          <p className="text-sm text-white/70 mt-1">
            There are no items to display for this section.
          </p>
        </div>
      );
  }
}
