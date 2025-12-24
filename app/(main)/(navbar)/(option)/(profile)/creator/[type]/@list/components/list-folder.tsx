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
            className="
            mb-3
            rounded-xl
            bg-white/5
            border border-white/10
            overflow-hidden
            transition
          ">
            {/* ===== YEAR HEADER ===== */}
            <button
              onClick={(e) => handleAction(e, "open", item.year)}
              className="
              flex items-center justify-between
              w-full
              px-4 py-3
              text-left
              text-sm font-semibold text-gray-200
              hover:bg-white/10
              transition
            ">
              <span>{item.year}</span>
              <ChevronDown
                size={16}
                className={`
                text-gray-400
                transition-transform duration-300
                ${openYear === item.year ? "rotate-180" : "rotate-0"}
              `}
              />
            </button>

            {/* ===== MONTH LIST ===== */}
            {openYear === item.year && (
              <div
                className="
                flex flex-col gap-1
                px-2 py-2
                bg-white/5
                border-t border-white/10
              ">
                {listMonth.map((i, idx) => (
                  <div key={idx}>
                    <button
                      onClick={(e) => handleAction(e, "year", openYear, i.num)}
                      className="
                      w-full
                      flex items-center justify-between
                      px-2 py-1.5
                      rounded-md
                      text-sm
                      text-gray-300
                      hover:bg-white/10 hover:text-gray-100
                      transition
                    ">
                      <span>{i.name}</span>
                      <span className="text-xs text-gray-400">
                        {item.month === i.num && item.totalProduct}
                      </span>
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
