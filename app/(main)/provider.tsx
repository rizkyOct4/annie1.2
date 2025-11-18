"use client";

import { ReactNode, useContext } from "react";
// import { useCategory } from "./hook/hook";
// import { categoryContext, profileContext } from "@/app/context";
import { profileContext } from "../context";

interface CategoryContextProps {
  children: ReactNode;
}

const ProfileContext: React.FC<CategoryContextProps> = ({ children }) => {
  const { data: getData } = useContext(profileContext);
  const publicId = getData?.publicId;

//   const a = useCategory(publicId);
//   //   const b = useCreatorButtonCRUD(publicId);

//   const value = {
//     ...a,
//     // ...b,
//     publicId,
//   };

  return (
    <profileContext.Provider value={""}>
      {children}
    </profileContext.Provider>
  );
};

export default ProfileContext;
