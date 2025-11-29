"use client";

// import SmallIcon from "@/components/sidebar/SmallIcon";
import { DiscoverSide } from "@/components/sidebar/discover/index ";
import { CommunitySide } from "@/components/sidebar/community/index ";
import { ActivitySide } from "@/components/sidebar/activity/index ";
import { DocsSide } from "@/components/sidebar/docs/index ";
// import type React from "react";
// import { useState } from "react";
// import { LayoutState } from "@/types/sidebar/Interface";

// const Sidebar = ({
//   children,
//   modal,
// }: {
//   children: React.ReactNode;
//   modal: React.ReactNode;
// }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState<LayoutState>({
//     isCommunity: false,
//     isDiscover: false,
//     isActivity: false,
//     isDocs: false,
//     isClose: false,
//   });

//   return (
//     <div className="w-full fixed top-[80px] h-screen z-130">
//       <div
//         className={`bg-black pt-8 border-r-[2px] border-r-[rgb(29,205,159)] transition-all duration-300 ease-in-out text-black h-[calc(100vh-64px)]  ${
//           isSidebarOpen.isClose ? "w-[8%]" : "w-[20%]"
//         }`}
//       >
//         <div className="flex items-start justify-between">
//           {/* // ? CONTAINER */}
//           <div
//             className={`flex flex-col justify-center items-center ${
//               !isSidebarOpen.isClose && "mx-5"
//             } w-full`}
//           >
//             {/* // ? HEADER */}
//             <SmallIcon
//               isSidebarOpen={isSidebarOpen}
//               setIsSidebarOpen={setIsSidebarOpen}
//             />
//             {!isSidebarOpen.isClose && (
//               <>
//                 <CommunitySide
//                   isSidebarOpen={isSidebarOpen}
//                   setIsSidebarOpen={setIsSidebarOpen}
//                 />
//                 <DiscoverSide
//                   isSidebarOpen={isSidebarOpen}
//                   setIsSidebarOpen={setIsSidebarOpen}
//                 />
//                 <ActivitySide
//                   isSidebarOpen={isSidebarOpen}
//                   setIsSidebarOpen={setIsSidebarOpen}
//                 />
//                 <DocsSide isSidebarOpen={isSidebarOpen} />
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <main
//         className={`absolute top-0 bottom-0 min-h-screen overflow-y-auto px-4  pt-4 pb-20 ${
//           isSidebarOpen.isClose ? "left-[8%] w-[92%]" : "left-[20%] w-[80%]"
//         }`}
//       >
//         {children}
//         {modal}
//       </main>
//     </div>
//   );
// };

// export default Sidebar;

import { useState } from "react";
import Link from "next/link";

import { FiUsers, FiCompass, FiActivity, FiBookOpen } from "react-icons/fi";
import { VscCommentDiscussion } from "react-icons/vsc";
import { BiLogoDailymotion } from "react-icons/bi";
import { SiGooglemeet } from "react-icons/si";

export default function Sidebar({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  // === MENU LIST (diambil dari CommunitySide) ===
  const communityMenus = [
    { icon: <VscCommentDiscussion />, label: "Discussion", to: "/discussion" },
    { icon: <BiLogoDailymotion />, label: "Challenges", to: "/challenges" },
    { icon: <SiGooglemeet />, label: "Meetup", to: "/meetup" },
  ];

  // Sidebar utama
  const sidebarItems = [
    {
      key: "community",
      icon: <FiUsers className="text-2xl" />,
      title: "Community",
      menus: communityMenus,
    },
    {
      key: "discover",
      icon: <FiCompass className="text-2xl" />,
      title: "Discover",
      menus: [
        { icon: "📌", label: "Discover 1", to: "#" },
        { icon: "⭐", label: "Discover 2", to: "#" },
      ],
    },
    {
      key: "activity",
      icon: <FiActivity className="text-2xl" />,
      title: "Activity",
      menus: [
        { icon: "📊", label: "Stats", to: "#" },
        { icon: "🏆", label: "Achievements", to: "#" },
      ],
    },
    {
      key: "docs",
      icon: <FiBookOpen className="text-2xl" />,
      title: "Docs",
      menus: [
        { icon: "📄", label: "Guides", to: "#" },
        { icon: "⚙️", label: "API", to: "#" },
      ],
    },
  ];

  return (
    <div className="w-full fixed top-[80px] h-screen z-[130] flex">
      {/* === SMALL SIDEBAR LEFT === */}
      <aside
        className="
          w-[80px] bg-black/80 backdrop-blur-sm 
          border-white/10
          flex flex-col items-center pt-6
          overflow-y-auto
        "
      >
        {sidebarItems.map((item) => (
          <div
            key={item.key}
            className="w-full flex flex-col items-center mb-4"
          >
            {/* === ICON BUTTON === */}
            <button
              title={item.title}
              onClick={() =>
                setActivePanel(activePanel === item.key ? null : item.key)
              }
              className="
                w-[48px] h-[48px]
                flex items-center justify-center
                mb-1
                rounded-md bg-white/10 border border-white/10 text-white
                hover:bg-white/20 hover:cursor-pointer transition group
              "
            >
              {item.icon}
            </button>

            {activePanel === item.key && (
              <div className="w-[80px] flex flex-col items-center mt-2 gap-2">
                {item.menus.map((m, i) => (
                  <Link
                    key={i}
                    title={m.label}
                    href={m.to}
                    className="w-[40px] h-[40px] flex items-center justify-center rounded-md 
                    bg-white/10 border border-white/10 text-white
                    hover:bg-white/20 transition"
                  >
                    <span className="text-xl">{m.icon}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 p-6 min-h-screen">
        {children}
        {modal}
      </main>
    </div>
  );
}
