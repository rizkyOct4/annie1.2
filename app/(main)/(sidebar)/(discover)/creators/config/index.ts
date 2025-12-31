
export const ROUTES_CREATORS = {
  GET: ({
    typeConfig,
    pageParams,
    targetId,
    key,
  }: {
    typeConfig: string;
    pageParams?: number;
    targetId?: string;
    key?: "photo" | "video" | "music"
  }) => {
    const limit = 10;
    switch (typeConfig) {
      case "creators":
        return `/creators/api?section=${pageParams}&limit=${limit}`;
      case "creatorsDescription":
        return `/creators/${targetId}/api`;
      case "listCreatorsProduct":
      case "listCreatorsProductVideo":
        return `/creators/${targetId}/api?key=${key}&section=${pageParams}&limit=${limit}`;
      default:
        return "";
    }
  },

  POST: ({ key, params }: { key: "likePost"; params: string }) => {
    switch (key) {
      case "likePost":
        return `/creators/${params}/api?action=post`;
      default:
        return "";
    }
  },
};
