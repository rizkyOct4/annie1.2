"use client";

import { useState, ReactNode } from "react";
import { profileContext } from "./context";
import type { ProfileContextType } from "./context";

interface ProfileProviderProps {
  children: ReactNode;
}

const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [data, setData] = useState<ProfileContextType | null>(null);
  // console.log(data);
  //   const refetchUser = async () => {
  //     try {
  //       const userData = await UserProfileData(
  //         state.user?.email,
  //         state.user?.token
  //       );
  //       dispatch({ type: "REFETCH_USER", payload: userData });
  //     } catch (error) {
  //       console.error("Failed to refetch user:", error);
  //     }
  //   };

  return (
    <profileContext.Provider value={{ data, setData }}>
      {children}
    </profileContext.Provider>
  );
};

export default ProfileProvider;
