"use client";

import { useState, useContext } from "react";
import { ChevronDown } from "lucide-react";
import { creatorContext } from "@/app/context";

const ListFolder = () => {
  const { listFolderData2 } = useContext(creatorContext);
  // console.log(listFolderData2.map((i) => i.year));

  const month = [
    { name: "january", num: 1 },
    { name: "february", num: 2 },
    { name: "march", num: 3 },
    { name: "april", num: 4 },
    { name: "may", num: 5 },
    { name: "june", num: 6 },
    { name: "july", num: 7 },
    { name: "august", num: 8 },
    { name: "september", num: 9 },
    { name: "october", num: 10 },
    { name: "november", num: 11 },
    { name: "december", num: 12 },
  ];

  // const list = listFolderData2.map((i: any) => ({
  //   year: i.year,
  //   month: i.month,
  //   folder: i.folders.map((f: any) => f.folder_name),
  // }));

  // console.log(list);

  const years =
    Array.isArray(listFolderData2) &&
    listFolderData2.map((i) => ({
      year: i.year,
      months: month.map((m) => m.num === i.month),
      folder: i.folders,
    }));

  console.log(years);

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


// todo KAU TUNTASKAN BESOK INI ! DIKIT LAGI !! FETCHING JUGA BERSIHKAN !!