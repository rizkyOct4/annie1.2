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
import { showToast } from "@/_util/Toast";
import { signOut } from "next-auth/react";

const Options = ({
  setState,
}: {
  setState: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { data: getData, setData } = useContext(profileContext);
  const id = getData?.id;
  const role = getData?.role;
  const router = useRouter();
  const pathname = usePathname();

  const optionSections = [
  {
    section: "Activity",
    items: [
      {
        label: "Notification",
        icon: <FaBell className="w-4 h-4" />,
        link: "/notification",
        actionType: "notification",
        count: 5,
      },
      {
        label: "Email",
        icon: <FaEnvelope className="w-4 h-4" />,
        link: "/email",
        actionType: "email",
        count: 9,
      },
    ],
  },
  {
    section: "Account",
    items: [
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
    ],
  },
  {
    section: "Auth",
    items: [
      {
        label: !id ? "Login" : "Logout",
        icon: !id ? (
          <IoIosLogIn className="w-4 h-4" />
        ) : (
          <FaSignOutAlt className="w-4 h-4" />
        ),
        link: !id ? `/auth?redirect=${encodeURIComponent(pathname)}` : "/",
        actionType: !id ? "login" : "logout",
      },
    ],
  },
];


  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const handleAction = useCallback(
    async (e: React.SyntheticEvent, actionType: string, link: string) => {
      e.preventDefault();
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
            await signOut({ redirectTo: "/" });
            setData(null);
            setState(false);
            showToast({ type: "success", fallback: "Logout Success" });
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
  className="
    absolute right-0 mt-4
    w-56
    rounded-xl
    bg-black/80
    backdrop-blur-md
    border border-white/10
    shadow-xl
    p-2
    z-101
    flex flex-col
  "
>
  {optionSections.map((section, sIdx) => (
    <div key={sIdx} className="flex flex-col gap-1">
      {/* SECTION TITLE */}
      <span
        className="
          px-3 py-1
          text-[11px] font-medium
          uppercase tracking-wide
          text-gray-400
        "
      >
        {section.section}
      </span>

      {/* SECTION ITEMS */}
      {section.items.map((item, i) => {
        const isActive = pathname === item.link;
        const isLogout = item.actionType === "logout" && logoutConfirm;

        return (
          <div
            key={i}
            className={`
              flex items-center
              rounded-lg
              transition
              ${isActive ? "bg-white/10" : "hover:bg-white/10"}
            `}
          >
            <button
              onClick={(e) => handleAction(e, item.actionType, item.link)}
              className="
                w-full
                flex items-center justify-between
                px-4 py-2
                text-sm
                text-gray-200
                transition
                focus:outline-none
              "
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>

              {/* Badge */}
              <span
                className={`
                  min-w-6
                  text-center
                  text-xs font-semibold
                  px-2 py-0.5
                  rounded-md
                  bg-white/10
                  border border-white/10
                  text-gray-300
                  ${!item.count ? "invisible" : ""}
                `}
              >
                {item.count || ""}
              </span>
            </button>

            {/* Logout confirm */}
            {isLogout && (
              <div className="flex items-center gap-1 pr-2">
                <button
                  type="button"
                  onClick={(e) => handleAction(e, "confirmLogout", "")}
                  className="
                    p-1.5
                    rounded-md
                    bg-red-600/80
                    hover:bg-red-600
                    transition
                  "
                >
                  <FaCheck className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  ))}
</div>

  );
};

export default memo(Options);
