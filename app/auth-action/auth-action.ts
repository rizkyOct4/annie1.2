import { signIn, signOut, useSession } from "next-auth/react";

export const DoLogIn = async (formData: any) => {
  const action = formData.get("action");
  await signIn(action, { redirectTo: "/notification" });
  console.log(action);
};

export const DoLogOut = () => {
  return;
};
