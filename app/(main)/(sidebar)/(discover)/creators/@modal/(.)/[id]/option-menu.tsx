"use client";

import {
  FaUser,
  FaImage,
  FaVideo,
  FaMusic,
  FaBoxOpen,
} from "react-icons/fa";
import { ModalState } from "../../types/interface";
import { memo } from "react";

const OptionsMenu = ({
  open,
  setOpen,
}: {
  open: ModalState;
  setOpen: React.Dispatch<React.SetStateAction<ModalState>>;
}) => {
  const options = [
    {
      label: "Profile",
      icon: <FaUser size={18} />,
    },
    {
      label: "Photos",
      icon: <FaImage size={18} />,
    },
    {
      label: "Videos",
      icon: <FaVideo size={18} />,
    },
    {
      label: "Music",
      icon: <FaMusic size={18} />,
    },
    {
      label: "Products",
      icon: <FaBoxOpen size={18} />,
    },
  ];

  return (
    <div
      className="
        w-20
        bg-black/80
        border-r border-white/10
        flex flex-col
        items-center
        py-4
        gap-2
      "
    >
      {options.map((i) => {
        const isActive = open.isValue === i.label;

        return (
          <button
            type="button"
            key={i.label}
            onClick={() =>
              setOpen((prev) => ({
                ...prev,
                isValue: i.label,
              }))
            }
            className={`
              w-full
              flex flex-col
              items-center
              gap-1
              py-3
              rounded-xl
            `}
          >
            {/* ICON */}
            <span
              className={`
                transition-colors
                ${
                  isActive
                    ? "text-emerald-400"
                    : "text-gray-400"
                }
              `}
            >
              {i.icon}
            </span>

            {/* LABEL */}
            <span
              className={`
                text-[10px]
                font-medium
                text-center
                transition-colors
                ${
                  isActive
                    ? "text-gray-300"
                    : "text-gray-500"
                }
              `}
            >
              {i.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default memo(OptionsMenu);
