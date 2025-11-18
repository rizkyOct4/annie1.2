"use client";

import { useCallback } from "react";
import Link from "next/link";
import { LuPanelRightClose } from "react-icons/lu";
import { RiCompassDiscoverLine } from "react-icons/ri";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { MdOutlineLeaderboard } from "react-icons/md";
import { VscCommentDiscussion } from "react-icons/vsc";
import { BiLogoDailymotion } from "react-icons/bi";
import { SiGooglemeet } from "react-icons/si";
import { LuPanelLeftClose } from "react-icons/lu";
import { RiUserCommunityLine } from "react-icons/ri";
import { MdOutlineBookmarks } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import { FiActivity } from "react-icons/fi";
import { SiGoogledocs } from "react-icons/si";
import { SiKeepachangelog } from "react-icons/si";
import { VscFeedback } from "react-icons/vsc";
import { LayoutState } from "@/types/sidebar/Interface";
// import Helper from "@/layout/Helper";

interface SmallIconProps {
  isSidebarOpen: LayoutState;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<LayoutState>>;
}

const discoverList = [
  {
    icon: <RiCompassDiscoverLine />,
    label: "Categories",
    to: "/side/categories",
  },
  {
    icon: <GiPlagueDoctorProfile />,
    label: "Creator",
    to: "/side/creator",
  },
  {
    icon: <MdOutlineLeaderboard />,
    label: "Leaderboard",
    to: "/side/leaderboard",
  },
];

const communityList = [
  {
    icon: <VscCommentDiscussion />,
    label: "Discussion",
    to: "/side/discussion",
  },
  {
    icon: <BiLogoDailymotion />,
    label: "Challenges",
    to: "/side/challenges",
  },
  { icon: <SiGooglemeet />, label: "Meetup", to: "/side/meetup" },
];

const activityList = [
  { icon: <MdOutlineBookmarks />, label: "History", to: "/side/history" },
  { icon: <GoHistory />, label: "Bookmark", to: "/side/bookmark" },
];

const docsList = [
  { icon: <SiGoogledocs />, label: "Docs", to: "/side/docs" },
  { icon: <SiKeepachangelog />, label: "Changelog", to: "/side/changelog" },
  { icon: <VscFeedback />, label: "Feedback", to: "/side/feedback" },
];

const SmallIcon = ({ isSidebarOpen, setIsSidebarOpen }: SmallIconProps) => {
  // const [isHover, setIsHover] = useState("");
  // const { setIsOpen } = Helper();

  // * HANDLER =====
  const handleAction = useCallback(
    (actionType: string) => {
      switch (actionType) {
        case "discover": {
          setIsSidebarOpen((prev) => ({
            ...prev,
            isDiscover: true,
          }));
          console.log(actionType);
          break;
        }
        case "open":
        case "close":
          {
            setIsSidebarOpen((prev) => ({
              ...prev,
              isClose: prev.isClose ? false : true,
            }));
            // setIsOpen((prev) => !prev);
          }
          break;
      }
    },
    [setIsSidebarOpen]
  );

  // useEffect(() => console.log(isHover), [isHover]);

  return (
    <>
      {!isSidebarOpen.isClose ? (
        <div className="flex justify-between items-center w-full">
          <h2 className="text-white">Menu</h2>
          <button
            onClick={() => handleAction("close")}
            className="hover:text-blue-500 w-6 h-6 flex justify-center items-center text-white"
          >
            <p>
              <LuPanelLeftClose />
            </p>
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4 my-2">
          <div className="hover:bg-red-600 w-12 h-12 flex justify-center items-center text-white mx-2 rounded-md">
            <button onClick={() => handleAction("open")}>
              <LuPanelRightClose className="text-3xl" />
            </button>
          </div>

          {/* // * ini parentnya untuk hover => group , child => group-hover !!! */}
          {/* // ? COMMUNITY */}
          <div className="flex flex-col items-center gap-2 group">
            <div className="hover:bg-red-600 w-12 h-12 flex justify-center items-center text-white rounded-l-md relative">
              <p>
                <RiUserCommunityLine
                  className="text-3xl"
                  // onMouseEnter={() => setIsHover("community")}
                  // onMouseLeave={() => setIsHover("")}
                />
              </p>
            </div>
            <div className="origin-top scale-y-0 max-h-0 group-hover:scale-y-100 group-hover:max-h-[500px] flex flex-col transition-all duration-300 ease-in-out">
              {communityList.map((i, idx) => (
                <div className="flex justify-center items-center" key={idx}>
                  <Link
                    href={i.to}
                    className="hover:bg-red-600 w-12 h-12 flex justify-center items-center text-white rounded-md text-2xl"
                  >
                    <p>{i.icon}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* // ? DISCOVER */}
          <div className="flex flex-col items-center gap-2 group">
            <div className="hover:bg-red-600 w-12 h-12 flex justify-center items-center text-white rounded-l-md relative">
              <p>
                <RiCompassDiscoverLine className="text-3xl" />
              </p>
            </div>
            <div className="origin-top scale-y-0 max-h-0 group-hover:scale-y-100 group-hover:max-h-[500px] flex flex-col transition-all duration-300 ease-in-out">
              {discoverList.map((i, idx) => (
                <Link
                  href={i.to}
                  className="flex justify-center items-center"
                  key={idx}
                >
                  <button className="hover:bg-red-600 w-12 h-12 flex justify-center items-center text-white rounded-md text-2xl">
                    <p>{i.icon}</p>
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* // ? ACTIVITY */}
          <div className="flex flex-col items-center gap-2 group">
            <div className="hover:bg-red-600 w-12 h-12 flex justify-center items-center text-white rounded-l-md relative">
              <p>
                <FiActivity className="text-3xl" />
              </p>
            </div>
            <div className="origin-top scale-y-0 max-h-0 group-hover:scale-y-100 group-hover:max-h-[500px] flex flex-col transition-all duration-300 ease-in-out">
              {activityList.map((i, idx) => (
                <div className="flex justify-center items-center" key={idx}>
                  <Link
                    href={i.to}
                    className="hover:bg-red-600 w-12 h-12 flex justify-center items-center text-white rounded-md text-2xl"
                  >
                    <p>{i.icon}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* // ? DOCS */}
          <div className="flex flex-col items-center gap-2 group">
            <div className="hover:bg-red-600 w-12 h-12 flex justify-center items-center text-white rounded-l-md relative">
              <p>
                <SiGoogledocs className="text-3xl" />
              </p>
            </div>
            <div className="origin-top scale-y-0 max-h-0 group-hover:scale-y-100 group-hover:max-h-[500px] flex flex-col transition-all duration-300 ease-in-out">
              {docsList.map((i, idx) => (
                <div className="flex justify-center items-center" key={idx}>
                  <Link
                    href={i.to}
                    className="hover:bg-red-600 w-12 h-12 flex justify-center items-center text-white rounded-md text-2xl"
                  >
                    <p>{i.icon}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SmallIcon;
