"use client";

import { useState, useContext, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { creatorContext } from "@/app/context";

const ListFolder = ({ currentPath }: { currentPath: string }) => {
  const { listFolderData, setStateContent } = useContext(creatorContext);

  const [openYear, setOpenYear] = useState<number | null>(null);

  const listMonth = [
    { name: "Jan", num: 1 },
    { name: "Feb", num: 2 },
    { name: "Mar", num: 3 },
    { name: "Apr", num: 4 },
    { name: "May", num: 5 },
    { name: "Jun", num: 6 },
    { name: "Jul", num: 7 },
    { name: "Aug", num: 8 },
    { name: "Sep", num: 9 },
    { name: "Oct", num: 10 },
    { name: "Nov", num: 11 },
    { name: "Dec", num: 12 },
  ];

  const handleAction = useCallback(
    (
      e: React.SyntheticEvent,
      actionType: string,
      year: number | null,
      month?: number
    ) => {
      e.preventDefault();
      switch (actionType) {
        case "open": {
          setOpenYear(openYear === year ? null : year);
          break;
        }
        case "year": {
          setStateContent({
            year: year,
            month: month,
          });
          // const newUrl = `${currentPath}?year=${year}&month=${month}`;
          // history.pushState({}, "", newUrl);
          break;
        }
      }
    },
    [openYear, setStateContent]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {Array.isArray(listFolderData) &&
        listFolderData.map((item) => (
          <div
            key={item.year}
            className="mb-2 rounded-lg bg-white/10 overflow-hidden border border-white/10">
            {/* YEAR BUTTON */}
            <button
              onClick={(e) => handleAction(e, "open", item.year)}
              className="flex items-center justify-between w-full text-left px-4 py-2 text-white font-medium hover:bg-white/20 transition">
              {item.year}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  openYear ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {openYear === item.year && (
              <div className="flex flex-col px-6 py-2 bg-white/20">
                {listMonth.map((i, idx) => (
                  <div key={idx} className="py-1 text-sm text-black ">
                    <button
                      onClick={(e) => handleAction(e, "year", openYear, i.num)}
                      className="w-full flex justify-between hover:text-white cursor-pointer transition">
                      <h4>{i.name}</h4>
                      <h4>{item.month === i.num && item.totalProduct}</h4>
                    </button>
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
