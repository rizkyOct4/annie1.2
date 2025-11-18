"use client";

import { ReactNode, useContext } from "react";
import { creatorsContext, profileContext } from "@/app/context";
import { useCreators, useCreatorsDescription } from "./hook/hook";

interface CategoryContextProps {
  children: ReactNode;
}

const CreatorsContext: React.FC<CategoryContextProps> = ({ children }) => {
  const { data: getData } = useContext(profileContext);
  const publicId = getData?.publicId;

  const a = useCreators()
  const b = useCreatorsDescription(publicId)

  const values = {
    ...a,
    ...b,
  }

  return (
    <creatorsContext.Provider value={values}>
      {children}
    </creatorsContext.Provider>
  );
};

export default CreatorsContext;
