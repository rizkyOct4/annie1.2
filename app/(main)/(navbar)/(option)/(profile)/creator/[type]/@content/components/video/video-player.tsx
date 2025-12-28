"use client";

import { VideoItem } from "../video-card";
import { memo } from "react";

// interface Props {
//   video: VideoItem;
//   onClose: () => void;
// }

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
        className="absolute top-6 right-6 text-white text-xl">
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
