/* eslint-disable react/display-name */
"use client";

import { memo } from "react";
import Link from "next/link";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { VscCommentDiscussion } from "react-icons/vsc";
import { BiLogoDailymotion } from "react-icons/bi";
import { SiGooglemeet } from "react-icons/si";
import type { MenuItemProps } from "@/types/sidebar/Types";
import type { LayoutState } from "@/types/sidebar/Interface";

interface CommunitySideProps {
  isSidebarOpen: LayoutState;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<LayoutState>>;
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

export const CommunitySide = memo(
  ({ isSidebarOpen, setIsSidebarOpen }: CommunitySideProps) => {
    return (
      <div className="w-full my-2">
        {/* Header */}
        <div className="flex justify-between items-center my-2 h-8">
          <h4 className="text-lg font-semibold text-white">Community</h4>
          <div className="flex justify-center items-center">
            <button
              onClick={() =>
                setIsSidebarOpen((prev) => ({
                  ...prev,
                  isCommunity: prev.isCommunity ? false : true,
                }))
              }
              className="flex justify-center items-center w-8 h-8 text-white"
            >
              {isSidebarOpen.isCommunity ? (
                <p>
                  <IoIosArrowUp />
                </p>
              ) : (
                <p>
                  <IoIosArrowDown />
                </p>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        <div
          className={`origin-top transition-all duration-300 ease-in-out transform ${
            isSidebarOpen.isCommunity
              ? "scale-y-100 opacity-100 max-h-[500px]"
              : "scale-y-0 opacity-0 max-h-0"
          } overflow-hidden`}
        >
          <div className="flex flex-col gap-2 my-2">
            <MenuItem
              icon={<VscCommentDiscussion />}
              label="Discussion"
              to="/discussion"
            />
            <MenuItem
              icon={<BiLogoDailymotion />}
              label="Challenges"
              to="/challenges"
            />
            <MenuItem icon={<SiGooglemeet />} label="Meetup" to="/meetup" />
          </div>
        </div>
      </div>
    );
  }
);
