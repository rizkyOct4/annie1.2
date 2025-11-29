"use client"

import { memo } from "react";


// Dummy milestone data
const milestones = [
  {
    id: 1,
    title: "Reach 1000 followers",
    status: "complete",
    date: "2025-10-15",
    progress: 100,
  },
  {
    id: 2,
    title: "Post 50 videos",
    status: "in-progress",
    date: "2025-11-20",
    progress: 60,
  },
  {
    id: 3,
    title: "Engagement rate > 5%",
    status: "in-progress",
    date: "2025-12-05",
    progress: 40,
  },
  {
    id: 4,
    title: "Upload 200 photos",
    status: "complete",
    date: "2025-11-10",
    progress: 100,
  },
];

const Milestones = () => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-sm">
      {milestones.map((m) => (
        <div
          key={m.id}
          className="flex flex-col gap-1 p-2 bg-gray-50 rounded hover:bg-gray-100"
        >
          <div className="flex justify-between">
            <span className="font-medium">{m.title}</span>
            <span
              className={`text-xs ${
                m.status === "complete" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {m.status}
            </span>
          </div>
          <div className="text-xs text-gray-500">{m.date}</div>
          <div className="w-full bg-gray-200 h-2 rounded mt-1">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${m.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(Milestones);
