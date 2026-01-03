"use client";

import { memo } from "react";

const VideoPlayer = ({ url, setIsOpen }: { url: string; setIsOpen: any }) => {

  return (
    <div className="overlay-v">
      <button
        onClick={() =>
          setIsOpen({
            open: false,
            url: "",
          })
        }
        className="absolute top-10 left-10 text-white text-xl">
        ✕
      </button>

      <video
        src={url}
        // poster={v.thumbnailUrl}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className="max-w-[80vw] max-h-[80vh] rounded-xl"
      />
    </div>
  );
};

export default memo(VideoPlayer);
