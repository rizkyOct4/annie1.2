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
    id?: string;
  }) => {
    const limit = 10;
    const folderNameLimit = 4;

    switch (typeConfig) {
      case "type":
        return `${BASE_URL}/creator/${type}/api?section=${pageParam}&limit=${limit}`;
      case "folderName":
        return `${BASE_URL}/creator/${type}/api?folder-name=${encodeURIComponent(
          folderName
        )}&section=${pageParam}&limit=${folderNameLimit}`;
      case "id":
        return `${BASE_URL}/creator/${type}/api?folder-name=${encodeURIComponent(
          `${folderName}`
        )}&id=${id}`;
      default:
        return ""; // ! fallback aman (tidak undefined)
    }
  },
  GET_BTN: ({ key }: { key: string }) => {
    switch (key) {
      case "photo":
      case "video": {
        return `${BASE_URL}/creator/${key}/api/post-button`;
      }
      default:
        return "";
    }
  },
};

export const CREATOR_CRUD = (
  key: string,
  method: string,
  type: "photo" | "video"
) => {
  switch (key) {
    case "photoPost": {
      return `${BASE_URL}/creator/api?method=${method}&type=${type}`;
    }
    case "videoPost": {
      return `${BASE_URL}/creator/api?method=${method}&type=${type}`;
    }
    default:
      return "";
  }
};
