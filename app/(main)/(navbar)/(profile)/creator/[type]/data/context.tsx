"use client";

import { creatorContext } from "@/app/context";
import { profileContext } from "@/app/context";
import { useCreatorPhoto, useCreatorButton } from "./hook/hook-photo";
import { ReactNode, useContext } from "react";
import { useCreatorVideo } from "./hook/hook-video";

interface CreatorContextProps {
  children: ReactNode;
}

const CreatorContext: React.FC<CreatorContextProps> = ({ children }) => {
  const { data: getData } = useContext(profileContext);
  const publicId = getData?.publicId;

  const photo = useCreatorPhoto(publicId);
  const video = useCreatorVideo(publicId);
  const z = useCreatorButton(publicId);

  const value = {
    ...photo,
    ...video,
    ...z,
    publicId,
  };

  return (
    <creatorContext.Provider value={value}>{children}</creatorContext.Provider>
  );
};

export default CreatorContext;
