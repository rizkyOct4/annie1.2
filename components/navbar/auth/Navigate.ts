import type { NavigateFunction } from "react-router-dom";

export async function NavigateLogin (navigate: NavigateFunction, role: string) {
  return navigate(`/profile/${role}/photo`);
};


