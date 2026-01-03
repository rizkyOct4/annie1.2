"use client";

import { creatorsContext } from "@/app/context";
import { memo, useContext, useState } from "react";

const videoCategories = [
  { name: "Cinematic", icon: "🎬" },
  { name: "Short Films", icon: "🎞️" },
  { name: "Documentary", icon: "📽️" },
  { name: "Vlog", icon: "📹" },
  { name: "Commercial & Ads", icon: "📺" },
  { name: "Music Video", icon: "🎵" },
  { name: "Animation & Motion Graphics", icon: "🌀" },
  { name: "Tutorial & Education", icon: "🎓" },
  { name: "Tech Reviews", icon: "💻" },
  { name: "Gaming", icon: "🎮" },
  { name: "Live Performance", icon: "🎤" },
  { name: "Interview & Podcast", icon: "🎙️" },
  { name: "Travel Video", icon: "🌍" },
  { name: "Food & Cooking", icon: "🍔" },
  { name: "Sports & Action", icon: "🏃‍♂️" },
  { name: "Drone & Aerial", icon: "🚁" },
  { name: "Timelapse", icon: "⏱️" },
  { name: "Behind The Scenes", icon: "🔧" },
  { name: "Fashion Film", icon: "👗" },
  { name: "Event Coverage", icon: "🎉" },
  { name: "Product Showcase", icon: "📦" },
  { name: "Social Media Reels", icon: "📲" },
  { name: "Stock Footage", icon: "🗂️" },
  { name: "Experimental", icon: "🧪" },
];

const OptionVideo = () => {
  const { sortVideo, setSortVideo } = useContext(creatorsContext);

  const [filterHashtag, setFilterHashtag] = useState("");

  return (
    <div
      className="
    flex flex-wrap items-center gap-3
    p-3 mb-4
    rounded-xl
    bg-white/5
    border border-white/10
    backdrop-blur-sm
  ">
      <button
        type="button"
        onClick={() =>
          setSortVideo((prev: string) =>
            prev === "latest" ? "oldest" : "latest"
          )
        }
        className="
    flex items-center gap-2
    text-xs
    px-3 py-2
    rounded-lg
    border border-white/10
    bg-black/40
    text-white
  ">
        <span>{sortVideo === "latest" ? "Latest" : "Oldest"}</span>
      </button>

      <select
        className="
      text-xs
      bg-black/40
      border border-white/10
      rounded-lg
      px-3 py-2
      text-white
      focus:outline-none
      focus:ring-1 focus:ring-white/20
    ">
        {videoCategories.map((i, idx) => (
          <option value={i.name} key={idx}>{i.name}</option>
        ))}
      </select>

      <div className="relative">
        <input
          type="text"
          placeholder="# Hashtag"
          value={filterHashtag}
          onChange={(e) => setFilterHashtag(e.target.value.replace("#", ""))}
          className="
      text-xs
      bg-black/40
      border border-white/10
      rounded-lg
      px-3 py-2
      text-white
      placeholder-gray-400
      focus:outline-none
      focus:ring-1 focus:ring-white/20
    "
        />

        {/* {filterHashtag && (
          <div
            className="
        absolute z-10 mt-1 w-full
        rounded-lg
        bg-black/90
        border border-white/10
      ">
            {hashtags
              .filter((tag) =>
                tag.toLowerCase().includes(filterHashtag.toLowerCase())
              )
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFilterHashtag(tag)}
                  className="
              w-full text-left
              px-3 py-2
              text-xs
              hover:bg-white/10
            ">
                  #{tag}
                </button>
              ))}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default memo(OptionVideo);
