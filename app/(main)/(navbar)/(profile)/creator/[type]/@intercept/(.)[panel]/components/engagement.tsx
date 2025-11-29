"use client";

import React from "react";

// Dummy engagement data
const engagementData = [
  {
    id: 1,
    type: "likes",
    label: "Likes",
    value: 420,
  },
  {
    id: 2,
    type: "comments",
    label: "Comments",
    value: 85,
  },
  {
    id: 3,
    type: "shares",
    label: "Shares",
    value: 32,
  },
  {
    id: 4,
    type: "saves",
    label: "Saves",
    value: 60,
  },
  {
    id: 5,
    type: "engagementRate",
    label: "Engagement Rate",
    value: 8.5, // dalam persen
  },
  {
    id: 6,
    type: "dailyGrowth",
    label: "Daily Growth",
    value: [
      { date: "2025-11-01", value: 50 },
      { date: "2025-11-02", value: 60 },
      { date: "2025-11-03", value: 75 },
      { date: "2025-11-04", value: 40 },
      { date: "2025-11-05", value: 65 },
    ],
  },
];

const Engagement = () => {
  const summary = engagementData.filter((d) => typeof d.value === "number");
  const dailyGrowth =
    engagementData.find((d) => d.type === "dailyGrowth")?.value || [];

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm">
      {/* Ringkasan engagement */}
      <div className="flex justify-between gap-2">
        {summary.map((item) => (
          <div
            key={item.id}
            className="flex-1 bg-gray-50 p-2 rounded text-center"
          >
            <p className="text-sm">{item.label}</p>
            <p className="font-semibold">
              {item?.value}
              {item.type === "engagementRate" ? "%" : ""}
            </p>
          </div>
        ))}
      </div>

      {/* Daily Growth */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-gray-600">Daily Growth</p>
        <div className="flex gap-2 overflow-x-auto">
          {dailyGrowth.map((d, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-gray-50 p-2 rounded min-w-[50px]"
            >
              <span className="text-xs">{d.date.slice(5)}</span>
              <span className="font-semibold">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Engagement;
