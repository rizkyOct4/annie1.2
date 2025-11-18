import { BASE_URL } from "@/_lib/config";

export const ROUTES_CREATORS = {
  GET: ({
    typeConfig,
    pageParams,
    publicId,
  }: {
    typeConfig: string;
    pageParams?: number;
    publicId?: string;
  }) => {
    const limit = 6;
    switch (typeConfig) {
      case "creators":
        return `${BASE_URL}/creators/api?section=${pageParams}&limit=${limit}`;
      case "creatorsDescription":
        return `${BASE_URL}/creators/${publicId}/api`;
      case "listCreatorsProduct":
        return `${BASE_URL}/creators/${publicId}/api?section=${pageParams}&limit=${limit}`;
      default:
        return "";
    }
  },

  POST: ({ key, params }: { key: "likePost"; params: string }) => {
    switch (key) {
      case "likePost":
        return `${BASE_URL}/creators/${params}/api?action=post`;
      default:
        return "";
    }
  },
};
