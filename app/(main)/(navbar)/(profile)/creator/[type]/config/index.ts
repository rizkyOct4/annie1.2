import { BASE_URL } from "@/_lib/config";

// ! Gunakan encodeURIComponent() agar nama folder dengan spasi atau karakter spesial tidak error (Ex: “My Folder”).
export const ROUTES_PROFILE = {
  GET: ({
    typeConfig,
    type,
    folderName,
    pageParam,
    id,
  }: {
    typeConfig: "type" | "folderName" | "id";
    type?: string;
    folderName?: any;
    pageParam?: number;
    id?: string | null;
  }) => {
    const limit = 10;
    const folderNameLimit = 5;

    switch (typeConfig) {
      case "type":
        return `${BASE_URL}/creator/${type}/api?section=${pageParam}&limit=${limit}`;
      case "folderName":
        return `${BASE_URL}/creator/${type}/api?folder-name=${encodeURIComponent(
          folderName
        )}&section=${pageParam}&limit=${folderNameLimit}`;
      case "id":
        return `${BASE_URL}/creator/${type}/api?folder-name=${encodeURIComponent(
          folderName
        )}&id=${id}`;
      default:
        return ""; // ! fallback aman (tidak undefined)
    }
  },
  GET_BTN: ({
    key,
    path,
    typeBtn,
    iuProduct,
  }: {
    key: string;
    path?: string;
    typeBtn?: string;
    iuProduct?: number;
  }) => {
    switch (key) {
      case "photo":
      case "video": {
        return `${BASE_URL}/creator/${key}/api/get-button?type-btn=${typeBtn}`;
      }
      default:
        return "";
    }
  },
  // * ======
  CRUD_IMAGE: ({
    method,
    type,
    path,
  }: {
    method: "post" | "put";
    type: "photo";
    path: string;
  }) => {
    switch (method) {
      case "post":
      case "put": {
        return `${BASE_URL}/creator/${path}/api/crud-image?method=${method}&type=${type}`;
      }
      default:
        return "";
    }
  },
  PUT: ({
    key,
    method,
    type,
    path,
  }: {
    key: string;
    method: string;
    type: "photo" | "video";
    path: string;
  }) => {
    switch (key) {
      case "putImage":
      case "videoPost": {
        return `${BASE_URL}/creator/${path}/api/post-button?method=${method}&type=${type}`;
      }
      default:
        return "";
    }
  },
};
