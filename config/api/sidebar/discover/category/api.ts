import { BASE_URL } from "@/_lib/config";

export const CATEGORY = (key?: string, params?: string, id?: string) => {
  switch (key) {
    case "category":
      return `${BASE_URL}/category/api?searchQuery=${key}`;
    case "listCategory":
      return `${BASE_URL}/category/${params}/api`;
    // return `${BASE_URL}/category/api?category=${encodeURIComponent(
    //   `${params}`
    // )}`;
    case "idCategory":
      return `${BASE_URL}/category/${params}/api?id=${encodeURIComponent(
        `${id}`
      )}`;
    default:
      return "";
  }
};
