"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const years = [
  { year: 2023, months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
  { year: 2022, months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
  { year: 2021, months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
];

const ListFolder = () => {
  const [openYear, setOpenYear] = useState<number | null>(null);

  const toggleYear = (year: number) => {
    setOpenYear(openYear === year ? null : year);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {years.map((item) => (
        <div key={item.year} className="mb-2 border border-gray-200 rounded-lg">
          {/* YEAR BUTTON */}
          <button
            onClick={() => toggleYear(item.year)}
            className=" flex items-center w-full text-left px-4 py-2 bg-gray-100 text-black font-medium rounded-t-lg hover:bg-gray-200 transition"
          >
            {item.year}
            <ChevronDown
              size={16}
              className={`transition-transform ${
                openYear ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* MONTH LIST */}
          {openYear === item.year && (
            <div className="flex flex-col px-6 py-2 bg-gray-50">
              {item.months.map((month, idx) => (
                <div
                  key={idx}
                  className="py-1 text-sm text-gray-700 hover:text-black cursor-pointer transition"
                >
                  {month}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListFolder;
