"use client";

import {
  FaBell,
  FaSignOutAlt,
  FaCheck,
  FaCog,
  FaEnvelope,
} from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { profileContext } from "@/app/context";
import { usePathname, useRouter } from "next/navigation";
import { memo, useContext, useCallback, useState } from "react";
import { CONFIG_AUTH } from "../(option)/auth-option/config/config-auth";
import axios from "axios";
import { showToast } from "@/_util/Toast";

const Options = ({
  setState,
}: {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: getData, setData } = useContext(profileContext);
  const role = getData?.role;
  const publicId = getData?.publicId;
  const router = useRouter();
  const pathname = usePathname();

  const optionList = [
    {
      label: "Notification",
      icon: <FaBell className="w-4 h-4" />,
      link: "/notification",
      actionType: "notification",
      count: 5,
    },
    {
      label: "Profile",
      icon: <GiPlagueDoctorProfile />,
      link: role ? `/${role}/photo` : "/",
      actionType: "profile",
    },
    {
      label: "Customize",
      icon: <FaCog className="w-4 h-4" />,
      link: "/customize",
      actionType: "customize",
    },
    {
      label: "Email",
      icon: <FaEnvelope className="w-4 h-4" />,
      link: "/email",
      actionType: "email",
      count: 9,
    },
    {
      label: !publicId ? "Login" : "Logout",
      icon: !publicId ? (
        <IoIosLogIn className="w-4 h-4" />
      ) : (
        <FaSignOutAlt className="w-4 h-4" />
      ),
      link: !publicId ? `/auth-option?redirect=${encodeURIComponent(pathname)}` : "/",
      actionType: !publicId ? "login" : "logout",
    },
  ];

  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleAction = useCallback(
    async (actionType: string, link: string) => {
      switch (actionType) {
        case "notification":
        case "customize":
        case "email":
        case "profile":
        case "login":
          setState(false);
          router.push(link);
          break;
        case "logout":
          setLogoutConfirm((prev) => !prev);
          break;
        case "confirmLogout":
          try {
            const URL = CONFIG_AUTH("logout");
            const { data } = await axios.post(URL, {
              withCredentials: true,
            });
            setData(null);
            setState(false);
            showToast({ type: "success", fallback: data.message });

            router.push("/homepage");
          } catch (error) {
            console.error(error);
          }
          break;
        default:
          console.warn("Unknown action:", actionType);
      }
    },
    [router, setState, setData]
  );

  return (
    <div
      className="absolute right-0 mt-6 w-54 bg-black/80
                 border border-white/20 rounded-md
                 flex flex-col overflow-hidden p-1.5 z-101"
    >
      {optionList.map((item, i) => {
        const isActive = pathname === item.link;
        const isLogout = item.actionType === "logout" && logoutConfirm;

        return (
          <div
            key={i}
            className={`flex items-center gap-2  ${
              isActive ? "bg-white/30" : "hover:bg-white/20"
            }`}
          >
            <button
              onClick={() => handleAction(item.actionType, item.link)}
              className={`w-full text-left px-4 py-2 flex items-center gap-3 text-white transition 
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>

              <span
                className={`bg-white/10 border border-white/10 text-white text-xs font-semibold px-2 py-0.5 rounded-md ${
                  !item.count ? "invisible" : ""
                }`}
              >
                {item.count || ""}
              </span>
            </button>
            {isLogout && (
              <div className="flex gap-1 px-1">
                <button
                  onClick={() => handleAction("confirmLogout", "")}
                  className="px-2 p-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  <FaCheck className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(Options);
