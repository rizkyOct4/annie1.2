import { BASE_URL } from "@/_lib/config";

export const CONFIG_AUTH = (key?: string) => {
  switch (key) {
    case "register":
      return `${BASE_URL}/auth/api?key=${key}`;
    case "login":
      return `${BASE_URL}/auth-option/api?key=${key}`;
    case "logout":
      return `${BASE_URL}/auth/api?key=${key}`;
    default:
      return "";
  }
};
