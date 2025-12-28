"use client";

import Image from "next/image";
import { TTargetCreatorsDescription } from "../../../types/type";
import { memo } from "react";

const CreatorDesc = ({ data }: { data: TTargetCreatorsDescription[] }) => {
  return (
    <div
      className="
    flex
    w-full
    h-full
    overflow-hidden
    rounded-xl
    bg-black/80
    border border-white/10
    backdrop-blur-sm
  ">
      {/* Left: Photo */}
      <div className="relative w-80 shrink-0">
        <Image
          src={data[0]?.picture ?? "/"}
          alt={"#"}
          fill
          sizes="(max-width: 320px) 100vw"
          className="object-cover"
        />
      </div>

      {/* Right: Description */}
      <div className="flex flex-col justify-between p-5 gap-4 flex-1">
        {/* Top: Name */}
        <div>
          <h2 className="text-lg font-semibold text-gray-200">
            {data[0]?.username}
          </h2>
        </div>

        {/* Middle: Biodata & Info */}
        <div className="flex flex-col gap-3 text-sm text-gray-300">
          <p>{data[0]?.biodata}</p>

          <div className="flex flex-col gap-1">
            <span className="text-gray-400">
              <strong className="text-gray-300">Gender:</strong>{" "}
              {data[0]?.gender}
            </span>
            <span className="text-gray-400">
              <strong className="text-gray-300">Phone:</strong>{" "}
              {data[0]?.phoneNumber}
            </span>
            <span className="text-gray-400">
              <strong className="text-gray-300">Location:</strong>{" "}
              {data[0]?.location}
            </span>
          </div>

          {Array.isArray(data[0]?.socialLink) && data[0]?.socialLink.length > 0
            ? data[0]?.socialLink.map((i: any) => (
                <a
                  key={i.platform}
                  href={i.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                text-sm
                font-medium
                text-blue-400
                break-all
              ">
                  {i.platform}
                </a>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default memo(CreatorDesc);
