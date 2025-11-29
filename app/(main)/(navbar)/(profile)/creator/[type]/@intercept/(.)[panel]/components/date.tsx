"use client";

import { memo } from "react";

const Date = () => {
  // Array tanggal 1-31 dengan nilai productCount dummy
  const dates = Array.from({ length: 31 }, (_, i) => ({
    date: i + 1,
    productCount: 14, // dummy product count
  }));

  return (
    <div className="flex flex-wrap gap-2 w-full">
      {dates.map((d) => (
        <div
          key={d.date}
          className="flex flex-col items-center justify-center w-[5.5%] h-12 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          <span className="text-sm font-medium">{d.date}</span>
          <span className="text-xs text-gray-500">{d.productCount}</span>
        </div>
      ))}
    </div>
  );
};

export default memo(Date);
