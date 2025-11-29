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
    (actionType: string, year: number | null, month?: number) => {
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
            className="mb-2 border border-gray-200 rounded-lg"
          >
            {/* YEAR BUTTON */}
            <button
              onClick={() => handleAction("open", item.year)}
              className=" flex items-center justify-between w-full text-left px-4 py-2 bg-gray-100 text-black font-medium rounded-t-lg hover:bg-gray-200 transition"
            >
              {item.year}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  openYear ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {openYear === item.year && (
              <div className="flex flex-col px-6 py-2 bg-gray-50">
                {listMonth.map((i, idx) => (
                  <div key={idx} className="py-1 text-sm text-gray-700 ">
                    <button
                      onClick={() =>
                        handleAction("year", openYear, i.num)
                      }
                      className="w-full flex justify-between hover:text-black cursor-pointer transition"
                    >
                      <h4>{i.name}</h4>
                      <h4>{item.month === i.num && item.folders.length}</h4>
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
