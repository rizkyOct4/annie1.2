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
  const { listItemFolderPhotoData, itemFolderVideoData } =
    useContext(creatorContext);

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
      return <div>Not found</div>;
  }
}
