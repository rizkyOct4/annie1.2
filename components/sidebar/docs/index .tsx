/* eslint-disable react/display-name */
"use client";

import { memo } from "react";
import Link from "next/link";
import { SiGoogledocs } from "react-icons/si";
import { SiKeepachangelog } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import type { MenuItemProps } from "@/types/sidebar/Types";
import type { LayoutState } from "@/types/sidebar/Interface";

interface DocsProps {
  isSidebarOpen: LayoutState;
}

// Reusable menu item
const MenuItem = ({ icon, label, to }: MenuItemProps) => {
  return (
    <Link
      href={to}
      className="flex justify-between items-center gap-4 bg-white px-4 py-1 rounded-sm hover:bg-accent hover:text-accent-foreground"
    >
      <div>{icon}</div>
      {label}
    </Link>
  );
};

export const DocsSide = memo(({ isSidebarOpen }: DocsProps) => {
  return (
    <div className="w-full my-2">
      {/* Collapsible Content */}
      <div
        className={`origin-top transition-all duration-300 ease-in-out transform ${
          !isSidebarOpen.isClose
            ? "scale-y-100 opacity-100 max-h-[500px]"
            : "scale-y-0 opacity-0 max-h-0"
        } overflow-hidden`}
      >
        <div className="flex justify-between items-center my-2 h-8">
          <h4 className="text-lg font-semibold text-white">Docs</h4>
        </div>
        <div className="flex flex-col gap-2 my-2">
          <MenuItem icon={<SiGoogledocs />} label="Docs" to="/docs" />
          <MenuItem
            icon={<SiKeepachangelog />}
            label="Changelog"
            to="/changelog"
          />
          <MenuItem icon={<VscFeedback />} label="Feedback" to="/feedback" />
        </div>
      </div>
    </div>
  );
});
