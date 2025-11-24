import { BASE_URL } from "@/_lib/config";

export const ROUTES_LIST_FOLDER = {
  GET: ({
    typeConfig,
    path,
    pageParam,
  }: {
    typeConfig: string;
    path: string;
    pageParam: number;
  }) => {
    const limit = 4;
    switch (typeConfig) {
      case "listFolderPhoto": {
        return `${BASE_URL}/creator/${path}/api-list?section=${pageParam}&limit=${limit}`;
      }
      default:
        return "";
    }
  },
};
