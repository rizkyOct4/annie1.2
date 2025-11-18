"use client";

import { FaBoxOpen, FaFlag, FaEnvelope, FaUser } from "react-icons/fa";
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
      label: "Products",
      icon: <FaBoxOpen size={18} />,
    },
    {
      label: "Email",
      icon: <FaEnvelope size={18} />,
    },
    {
      label: "Report",
      icon: <FaFlag size={18} />,
    },
  ];
  return (
    <div className="w-20 bg-white rounded-r-lg flex flex-col items-center py-4 gap-4">
      {options.map((i) => (
        <button
          key={i.label}
          onClick={() => {
            setOpen((prev) => ({
              ...prev,
              isValue: i.label,
            }));
          }}
          className={`${
            open.isValue === i.label && "text-blue-600"
          } flex-center flex-col gap-1 w-full py-3 hover:text-blue-600 transition-colors rounded-lg`}
        >
          {i.icon}
          <span className="text-[10px] font-medium text-gray-600 text-center">
            {i.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default memo(OptionsMenu);

// https://www.youtube.com/watch?v=3jkX_UpTQ7Y&list=RD3jkX_UpTQ7Y&start_radio=1
