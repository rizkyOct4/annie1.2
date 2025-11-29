"use client";

import { memo } from "react";

// Dummy data: views per hari selama seminggu
const chartData = [
  { day: "Mon", views: 1200 },
  { day: "Tue", views: 1500 },
  { day: "Wed", views: 1000 },
  { day: "Thu", views: 1800 },
  { day: "Fri", views: 900 },
  { day: "Sat", views: 2000 },
  { day: "Sun", views: 1700 },
];

const Charts = () => {
  // Hitung max untuk skala
  const maxViews = Math.max(...chartData.map((d) => d.views));

  return (
    <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <h2 className="font-semibold text-lg text-neutral-800 mb-4">
        Weekly Views
      </h2>

      <div className="flex items-end justify-between h-32 gap-2">
        {chartData.map((data) => {
          const heightPercent = (data.views / maxViews) * 100;
          return (
            <div
              key={data.day}
              className="flex flex-col items-center justify-end flex-1"
            >
              {/* Bar */}
              <div
                className="w-3 bg-emerald-500 rounded-t-md transition-all duration-300"
                style={{ height: `${heightPercent}%` }}
              />
              {/* Label */}
              <span className="text-xs text-neutral-500 mt-1">{data.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Charts);
