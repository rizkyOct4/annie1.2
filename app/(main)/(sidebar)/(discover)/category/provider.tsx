"use client";

import { ReactNode, useContext } from "react";
import { useCategory } from "./hook/hook";
import { categoryContext, profileContext } from "@/app/context";

interface CategoryContextProps {
  children: ReactNode;
}

const CategoryContext: React.FC<CategoryContextProps> = ({ children }) => {
  const { data: getData } = useContext(profileContext);
  const publicId = getData?.publicId;

  const a = useCategory(publicId);
  //   const b = useCreatorButtonCRUD(publicId);

  const value = {
    ...a,
    // ...b,
    publicId,
  };

  return (
    <categoryContext.Provider value={value}>
      {children}
    </categoryContext.Provider>
  );
};

export default CategoryContext;
