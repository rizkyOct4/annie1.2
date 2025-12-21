import { BASE_URL } from "@/_lib/config";

// ! Gunakan encodeURIComponent() agar nama folder dengan spasi atau karakter spesial tidak error (Ex: “My Folder”).
export const ROUTES_PROFILE = {
  GET_BTN: ({
    key,
    path,
    typeBtn,
    idProduct,
  }: {
    key: string;
    path?: string;
    typeBtn?: string;
    idProduct?: number | null;
  }) => {
    switch (key) {
      case "photo":
      case "video": {
        return `/creator/${key}/api-general?type-btn=${typeBtn}`;
      }
      case "getUpdate": {
        return `/creator/${path}/api-general?id-product=${idProduct}`;
      }
      default:
        return "";
    }
  },
  // * ======
  ACTION_PHOTO: ({
    method,
    type,
    path,
  }: {
    method: any;
    type: "photo";
    path?: string;
  }) => {
    switch (method) {
      case "post":
      case "put": {
        return `/creator/${path}/api-content/action?method=${method}&type=${type}`;
      }
      case "putNameFolder": {
        return `/creator/${path}/api-content/action?change-folder=${true}&type=${type}`;
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
