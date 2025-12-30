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
import Link from "next/link";
import { FiHome } from "react-icons/fi";
import { FiSliders } from "react-icons/fi";
import { TbAtom } from "react-icons/tb";



const Sidebar = ({
  children,
  intAuth,
}: {
  children: React.ReactNode;
  intAuth: React.ReactNode;
}) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

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
    <div className="w-full fixed h-screen z-100 flex">
      {/* ===== SIDEBAR ===== */}
      <aside
        className="
      w-20
      bg-black/80
      backdrop-blur-md
      border-r border-emerald-500
      flex flex-col items-center
      pt-6
      overflow-y-auto
    ">
        <div className="w-full flex flex-col items-center mb-5">
          <Link
            href="/"
            title="Next Prototype 1.2"
            className="
      w-14 h-14
      flex items-center justify-center
      rounded-2xl
      border border-emerald-500/40
      bg-emerald-500/10
      text-emerald-400
      shadow-lg shadow-emerald-500/10
      transition-all duration-200
      hover:bg-emerald-500/20
      hover:scale-105
      active:scale-95
    ">
            <TbAtom className="text-4xl" />
          </Link>
        </div>
        {sidebarItems.map((item) => (
          <div
            key={item.key}
            className="w-full flex flex-col items-center mb-5">
            <button
              title={item.title}
              onClick={() =>
                setActivePanel(activePanel === item.key ? null : item.key)
              }
              className={`
      w-12 h-12
      flex items-center justify-center
      rounded-xl
      border
      transition
      ${
        activePanel === item.key
          ? "bg-white/10 border-emerald-500/40 text-emerald-400"
          : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20"
      }
    `}>
              {item.icon}
            </button>

            {/* SUB MENU */}
            {activePanel === item.key && (
              <div
                className="
              w-full
              mt-3
              flex flex-col items-center gap-2
            ">
                {item.menus.map((m, i) => (
                  <Link
                    key={i}
                    href={m.to}
                    title={m.label}
                    className="
      w-10 h-10
      flex items-center justify-center
      rounded-lg
      bg-white/5
      border border-white/10
      text-gray-200
      hover:bg-white/10 hover:text-emerald-500 hover:border-white/20
      transition
    ">
                    <span className="text-lg">{m.icon}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main
        className="
      flex-1
      min-h-screen
      pb-20
      overflow-y-auto
      bg-black/60
      pt-4
      px-10
    ">
        {intAuth}
        {children}
      </main>
    </div>
  );
};

export default memo(Sidebar);
