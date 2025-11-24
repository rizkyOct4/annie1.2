"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const folderOptions = [
  "All Products",
  "T-Shirts",
  "Shoes",
  "Posters",
  "Accessories",
  "Digital Art",
];

export default function FolderFilter({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("All Products");

  return (
    <div className="relative">
      {/* FILTER BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 
                   rounded-lg text-sm font-medium text-black hover:bg-gray-200 transition-all"
      >
        {selected}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-sm z-50">
          {folderOptions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelected(item);
                onSelect(item);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
