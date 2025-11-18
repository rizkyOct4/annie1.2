"use client";

import SmallIcon from "@/components/sidebar/SmallIcon";
import { DiscoverSide } from "@/components/sidebar/discover/index ";
import { CommunitySide } from "@/components/sidebar/community/index ";
import { ActivitySide } from "@/components/sidebar/activity/index ";
import { DocsSide } from "@/components/sidebar/docs/index ";
import type React from "react";
import { useState } from "react";
import { LayoutState } from "@/types/sidebar/Interface";

const Sidebar = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<LayoutState>({
    isCommunity: false,
    isDiscover: false,
    isActivity: false,
    isDocs: false,
    isClose: false,
  });

  // useEffect(() => console.log(isSidebarOpen.isClose), [isSidebarOpen])

  return (
    <div className="w-full fixed top-[80px] h-screen z-130">
      <div
        className={`bg-black pt-8 border-r-[2px] border-r-[rgb(29,205,159)] transition-all duration-300 ease-in-out text-black h-[calc(100vh-64px)]  ${
          isSidebarOpen.isClose ? "w-[8%]" : "w-[20%]"
        }`}
      >
        <div className="flex items-start justify-between">
          {/* // ? CONTAINER */}
          <div
            className={`flex flex-col justify-center items-center ${
              !isSidebarOpen.isClose && "mx-5"
            } w-full`}
          >
            {/* // ? HEADER */}
            <SmallIcon
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            {!isSidebarOpen.isClose && (
              <>
                <CommunitySide
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <DiscoverSide
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <ActivitySide
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
                <DocsSide isSidebarOpen={isSidebarOpen} />
              </>
            )}
          </div>
        </div>
      </div>
      <main
        className={`absolute top-0 bottom-0 min-h-screen overflow-y-auto px-4  pt-4 pb-20 ${
          isSidebarOpen.isClose ? "left-[8%] w-[92%]" : "left-[20%] w-[80%]"
        }`}
      >
        {children}
        {modal}
      </main>
    </div>
  );
};

export default Sidebar;
