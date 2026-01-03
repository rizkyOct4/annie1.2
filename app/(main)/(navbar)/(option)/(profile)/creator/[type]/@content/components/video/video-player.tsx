"use client";

import { VideoItem } from "../video-card";
import { memo } from "react";


const VideoPlayerModal = ({
  data,
  setIsRender,
}: {
  data: any;
  setIsRender: any;
}) => {
  return (
    <div className="overlay backdrop-blur-sm">
      <button
        onClick={() =>
          setIsRender((prev: any) => ({
            ...prev,
            value: "",
            url: "",
            thumbnailUrl: "",
          }))
        }
        className="absolute top-10 left-10 text-white text-xl">
        ✕
      </button>

      <video
        src={data.url}
        poster={data.thumbnailUrl}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className="max-w-[80vw] max-h-[80vh] rounded-xl"
      />
    </div>
  );
};

export default memo(VideoPlayerModal);
