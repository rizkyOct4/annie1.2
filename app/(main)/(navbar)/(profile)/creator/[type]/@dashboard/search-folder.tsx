"use client";

import { Search } from "lucide-react";

const SearchFolder = ({ currentPath }: { currentPath: string }) => {
  return (
    <div className="w-full max-w-xs">
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-3 text-gray-500" />

        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black transition-all"
        />
      </div>
    </div>
  );
};

export default SearchFolder;
