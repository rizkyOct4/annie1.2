"use client";

import { IoIosLogIn } from "react-icons/io";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { SlOptionsVertical } from "react-icons/sl";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useState, useCallback, memo, useContext } from "react";
import { profileContext } from "@/app/context";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const { data: getData } = useContext(profileContext);
  const role = getData?.role;
  const redirect = usePathname();
  const router = useRouter()

  const navbarList = [
    { name: "Homepage", icon: <IoHomeOutline />, link: "/homepage" },
    {
      name: "Profile",
      icon: <GiPlagueDoctorProfile />,
      link: role ? `/${role}/photo` : "/",
    },
    {
      name: "Auth",
      icon: <IoIosLogIn />,
      link: `/auth?redirect=${encodeURIComponent(redirect)}`,

    },
  ];

  const [state, setState] = useState({
    isOpenNotification: false,
    isOpenOption: false,
  });

  // const handleAction = useCallback(
  //   (e: React.SyntheticEvent, actionType: string) => {
  //     e.preventDefault();
  //     switch (actionType) {
  //       case "option": {
  //         setState((prev) => ({
  //           isOpenNotification: false,
  //           isOpenOption: prev.isOpenOption ? false : true,
  //         }));
  //         break;
  //       }
  //       case "notification": {
  //         setState((prev) => ({
  //           isOpenOption: false,
  //           isOpenNotification: prev.isOpenNotification ? false : true,
  //         }));
  //         break;
  //       }
  //     }
  //   },
  //   []
  // );

  return (
    <div className="fixed top-0 left-0 right-0 w-full h-[80px] z-100 flex justify-between items-center py-4 px-8 border-b-[2px] border-b-[rgb(29,205,159)] bg-black">
      <div className="text-white">Next Prototype</div>
      <div className="flex items-center gap-6 relative">
        <div>
          <button
            className="bg-red-500 flex justify-center items-center p-2 rounded-md"
            // onClick={(e) => handleAction(e, "notification")}
          >
            <p className="text-2xl">
              {state.isOpenNotification ? (
                <AiOutlineFullscreenExit className="icon" />
              ) : (
                <IoMdNotificationsOutline className="icon" />
              )}
            </p>
          </button>
          {/* {state.isOpenNotification && <NavbarNotification />} */}
        </div>
        {Array.isArray(navbarList) &&
          navbarList.map((i, index) => (
            <button
              key={index}
              onClick={() => router.push(i.link)}
              className="flex justify-center items-center gap-1 bg-white text-black py-2 px-4 rounded-md"
            >
              <span className="icon">{i.icon}</span>
              {i.name}
            </button>
          ))}
        {/* {!userData && (
          <Link to="/register-login" className="nav-link-button">
            <span>
              <IoIosLogIn className="icon" />
            </span>
            Login
          </Link>
        )} */}
        <div className="relative">
          <button
            className="flex justify-center items-center h-auto text-white"
            // onClick={(e) => handleAction(e, "option")}
          >
            {state.isOpenOption ? (
              <AiOutlineFullscreenExit className="icon" />
            ) : (
              <SlOptionsVertical className="icon" />
            )}
          </button>
          {/* {state.isOpenOption && (
            <Options userData={userData} setState={setState} />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default memo(Navbar);
