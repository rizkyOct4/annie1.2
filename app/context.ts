import { createContext } from "react";

export type ProfileContextType = {
  firstName: string;
  lastName: string;
  role: string;
  publicId: string;
  createdAt: string;
};

// * ================ PROFILE ================
const profileContext = createContext<any>(null);

// * NAVBAR
export const creatorContext = createContext<any>(null)

// * SIDEBAR
const categoryContext = createContext<any>(null);
const creatorsContext = createContext<any>(null);

export { profileContext, categoryContext, creatorsContext };
