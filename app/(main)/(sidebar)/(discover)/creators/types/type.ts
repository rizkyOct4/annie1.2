export type CreatorsType = {
  firstName: string;
  lastName: string;
  publicId: string;
  createdAt: Date;
  username?: string | undefined;
  picture?: string | undefined;
};

export type OriginalCreatorsDescription = {
  data: TTargetCreatorsDescription[];
  hasMore: boolean;
};

export type TTargetCreatorsDescription = {
  publicId: string;
  username?: string;
  biodata?: string;
  gender?: string;
  phoneNumber?: number | null;
  location?: string | null;
  picture?: string;
  socialLink?: [
    {
      platform: string;
      value: string;
    }
  ];
  createdAt: Date;
  totalPhoto: number;
  totalVideo: number;
  totalFollowers: number;
  statusFollow: boolean;
};

export type OriginalCreatorListData = {
  data: TListCreatorProduct[];
  hasMore: boolean;
};

export type TListCreatorProduct = {
  idProduct: number;
  description: string;
  url: string;
  hashtag: string[];
  category: string[];
  createdAt: Date;
  totalLike: number;
  totalDislike: number;
  status: string | null;
};

export type TListCreatorVideo = {
  category: string[];
  createdAt: Date;
  description: string;
  duration: number;
  hashtag: string[]
  idProduct: number;
  status: null | boolean;
  thumbnailUrl: string;
  totalLike: number;
  totalDislike: number;
  url: string
}

// ? POST ACTION LIKE / DISLIKE
export type TPostActionLikeOrDislike = {
  idVote: number;
  refIdReceiver: string;
  refIdProduct: number;
  like: number | null;
  dislike: number | null;
  status: string;
  createdAt: Date;
};

export type TPostActionFollow = {
  idReceiver: string;
  status: boolean;
};
