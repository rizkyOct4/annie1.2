export type CreatorsType = {
  firstName: string;
  lastName: string;
  publicId: string;
  createdAt: Date;
  username?: string | undefined;
  picture?: string | undefined;
};

export type CreatorDescriptionType = {
  firstName: string;
  lastName: string;
  username?: string;
  biodata?: string;
  gender?: string;
  picture?: string;
  socialLink?: [
    {
      platform: string;
      value: string;
    }
  ];
};

export type OriginalCreatorListData = {
  data: ListCreatorProductType[];
  hasMore: boolean;
};

export type ListCreatorProductType = {
  iuProduct: number;
  description: string;
  url: string;
  hashtag: string[];
  category: string[];
  createdAt: Date;
  totalLike: number;
  totalDislike: number;
};
