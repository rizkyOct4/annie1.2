"use client";

import VideoPlayer from "@/app/(main)/(navbar)/(option)/(profile)/creator/[type]/@content/components/video/video-p";
import Image from "next/image";
import { useState } from "react";
import { TListCreatorVideo } from "../../../../types/type";
import OptionVideo from "./options";

const VideoContainer = ({ data }: { data: TListCreatorVideo[] }) => {
  const [isOpen, setIsOpen] = useState({
    open: false,
    url: "",
  });

  return (
    <>
      <OptionVideo />

      {Array.isArray(data) && data.length > 0
        ? data.map((i, idx) => (
            <div
              key={idx}
              className="
                flex gap-6 p-4
                rounded-xl
                bg-white/5
                border border-white/10
                backdrop-blur-sm
                w-full mb-4">
              {/* LEFT - Thumbnail */}
              <button
                className="relative w-60 h-36 shrink-0 rounded-lg overflow-hidden"
                onClick={() =>
                  setIsOpen({
                    open: true,
                    url: i.url,
                  })
                }>
                <Image
                  src={i.thumbnailUrl}
                  alt="Video thumbnail"
                  fill
                  sizes="(max-width: 200px) 100vw"
                  className="object-cover"
                />
                <span className="absolute bottom-1 right-1 text-xs px-2 py-0.5 rounded-md bg-black/70">
                  29.2s
                </span>
              </button>

              {/* RIGHT - Info */}
              <div className="flex flex-col gap-2 flex-1">
                {/* Title + Status */}
                <div className="flex items-center justify-between">
                  <h1 className="text-sm font-semibold text-white">
                    {i.description}
                  </h1>

                  <span
                    className="
          text-xs px-2 py-0.5
          rounded-full
          bg-green-500/10
          text-green-400
        ">
                    Public
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {i.category.map((cat: string) => (
                    <p
                      key={cat}
                      className="px-2 py-0.5 text-[11px] font-medium rounded-md
                    bg-white/10 text-gray-300 border border-white/10">
                      {cat}
                    </p>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {i.hashtag.map((tag: any) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 text-xs text-gray-400 mt-auto">
                  {new Date(i.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        : null}
      {isOpen.open && <VideoPlayer url={isOpen.url} setIsOpen={setIsOpen} />}
    </>
  );
};

export default VideoContainer;
