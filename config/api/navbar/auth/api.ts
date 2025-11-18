import { BASE_URL } from "@/_lib/config";

export const AUTH = (key?: string) => {
  switch (key) {
    case "register":
      return `${BASE_URL}/auth/api?key=${key}`;
    case "login":
      return `${BASE_URL}/auth/api?key=${key}`;
    default:
      return "";
  }
};
