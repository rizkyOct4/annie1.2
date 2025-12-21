"use client";

import { creatorContext } from "@/app/context";
import { profileContext } from "@/app/context";
import { useContentProfile, useItemDescription, useCreatorButton } from "../hook/hook-photo";
import { ReactNode, useContext } from "react";
// import { useCreatorVideo } from "./hook/hook-video";

interface CreatorContextProps {
  children: ReactNode;
}

const CreatorContext: React.FC<CreatorContextProps> = ({ children }) => {
  const { data: getData } = useContext(profileContext);
  const id = getData?.id;

  const content = useContentProfile(id)
  const itemFolderDescription = useItemDescription(id)
  // const video = useCreatorVideo(publicId);
  const z = useCreatorButton(id);

  const value = {
    ...content,
    ...itemFolderDescription,
    // ...video,
    ...z,
  };

  return (
    <creatorContext.Provider value={value}>{children}</creatorContext.Provider>
  );
};

export default CreatorContext;
