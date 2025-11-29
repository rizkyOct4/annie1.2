"use client"

import { memo } from "react";

const Overview = () => {
  const data = {
    totalContent: 42,
    totalViews: 12890,
    totalLikes: 2400,
    totalComments: 312,
    growth: "+12.5%",
  };

  return (
    <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg text-neutral-800 tracking-wide">
          Overview
        </h2>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-4">
        {/* Total Content */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Total Content</span>
          <span className="text-lg font-semibold text-neutral-800">
            {data.totalContent}
          </span>
        </div>

        {/* Total Views */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Total Views</span>
          <span className="text-lg font-semibold text-neutral-800">
            {data.totalViews.toLocaleString()}
          </span>
        </div>

        {/* Total Likes */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Total Likes</span>
          <span className="text-lg font-semibold text-neutral-800">
            {data.totalLikes.toLocaleString()}
          </span>
        </div>

        {/* Total Comments */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Total Comments</span>
          <span className="text-lg font-semibold text-neutral-800">
            {data.totalComments.toLocaleString()}
          </span>
        </div>

        {/* Growth */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Growth</span>
          <span className="text-lg font-semibold text-emerald-600">
            {data.growth}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(Overview);
