/* eslint-disable react/display-name */
"use client";

import { memo } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiCompassDiscoverLine } from "react-icons/ri";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { MdOutlineLeaderboard } from "react-icons/md";
import Link from "next/link";
import type { LayoutState } from "@/types/sidebar/Interface";
import type { MenuItemProps } from "@/types/sidebar/Types";

interface DiscoverSideProps {
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

export const DiscoverSide = memo(
  ({ isSidebarOpen, setIsSidebarOpen }: DiscoverSideProps) => {
    // const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="w-full my-2">
        {/* Header */}
        <div className="flex justify-between items-center my-2 h-8">
          <h4 className="text-lg font-semibold text-white">Discover</h4>
          <div className="flex justify-center items-center">
            <button
              onClick={() =>
                setIsSidebarOpen((prev) => ({
                  ...prev,
                  isDiscover: prev.isDiscover ? false : true,
                }))
              }
              className="flex justify-center items-center w-8 h-8 text-white"
            >
              {isSidebarOpen.isDiscover ? (
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
            isSidebarOpen.isDiscover
              ? "scale-y-100 opacity-100 max-h-[500px]"
              : "scale-y-0 opacity-0 max-h-0"
          } overflow-hidden`}
        >
          <div className="flex flex-col gap-2 my-2">
            <MenuItem
              icon={<RiCompassDiscoverLine />}
              label="Category"
              to="/category"
            />
            <MenuItem
              icon={<GiPlagueDoctorProfile />}
              label="Creators"
              to="/creators"
            />
            <MenuItem
              icon={<MdOutlineLeaderboard />}
              label="Leaderboard"
              to="/leaderboard"
            />
          </div>
        </div>
      </div>
    );
  }
);
// export memo(DiscoverSide);
