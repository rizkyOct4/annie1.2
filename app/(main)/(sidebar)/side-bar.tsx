"use client";

import { useState, memo } from "react";
import {
  FiUsers,
  FiCompass,
  FiActivity,
  FiBookOpen,
  FiPlayCircle,
  FiCheckCircle,
  FiCode,
  FiClock,
  FiShield,
  FiFlag,
} from "react-icons/fi";
import { VscCommentDiscussion } from "react-icons/vsc";
import { BiLogoDailymotion, BiCategory } from "react-icons/bi";
import { SiGooglemeet } from "react-icons/si";
import { TbUserStar } from "react-icons/tb";
import { useRouter } from "next/navigation";

const Sidebar = ({
  children,
  intercept,
}: {
  children: React.ReactNode;
  intercept: React.ReactNode;
}) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const router = useRouter();

  const sidebarItems = [
    {
      key: "community",
      icon: <FiUsers className="text-2xl" />,
      title: "Community",
      menus: [
        {
          icon: <VscCommentDiscussion />,
          label: "Discussion",
          to: "/discussion",
        },
        { icon: <BiLogoDailymotion />, label: "Challenges", to: "/challenges" },
        { icon: <SiGooglemeet />, label: "Meetup", to: "/meetup" },
      ],
    },
    {
      key: "discover",
      icon: <FiCompass className="text-2xl" />,
      title: "Discover",
      menus: [
        { icon: <TbUserStar />, label: "Creators", to: "/creators" },
        { icon: <BiCategory />, label: "Category", to: "/category" },
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
        {
          icon: <FiPlayCircle />,
          label: "Getting Started",
          to: "/getting-started",
        },
        {
          icon: <FiCheckCircle />,
          label: "Posting Guidelines",
          to: "/guidelines",
        },
        { icon: <FiCode />, label: "API & Webhooks", to: "/api" },
        { icon: <FiClock />, label: "Changelog", to: "/changelog" },
        { icon: <FiShield />, label: "Legal", to: "/legal" },
        { icon: <FiFlag />, label: "Report", to: "/report" },
      ],
    },
  ];

  return (
    <div className="w-full fixed top-20 h-screen z-100 flex ">
      <aside
        className="
          w-20 bg-black/80 backdrop-blur-sm 
          border-white/10
          flex flex-col items-center pt-6
          overflow-y-auto
          border-r-white border-r-2
        ">
        {sidebarItems.map((item) => (
          <div
            key={item.key}
            className="w-full flex flex-col items-center mb-4">
            {/* === ICON BUTTON === */}
            <button
              title={item.title}
              onClick={() =>
                setActivePanel(activePanel === item.key ? null : item.key)
              }
              className="
                w-12 h-12
                flex items-center justify-center
                mb-1
                rounded-md bg-white/10 border border-white/10 text-white
                hover:bg-white/20 hover:cursor-pointer transition group
              ">
              {item.icon}
            </button>

            {activePanel === item.key && (
              <div className="w-20 flex flex-col items-center mt-2 gap-2">
                {item.menus.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    title={m.label}
                    onClick={() => router.push(m.to)}
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-white/10 border border-white/10 text-white hover:bg-white/20 transition relative">
                    <span className="text-xl">{m.icon}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>
      {/* === MAIN CONTENT === */}
      <main className="flex-1 pb-10 min-h-screen overflow-y-auto bg-black/80">
        {intercept}
        {children}
      </main>
    </div>
  );
};

export default memo(Sidebar);
