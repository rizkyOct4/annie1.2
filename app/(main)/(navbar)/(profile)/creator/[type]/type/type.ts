export type ListFolderType = {
  folderName: string;
  totalProduct: number;
};
export type ItemFolderType = {
  tarIuProduct: number;
  url: string;
};
export type ItemFolderDescriptionType = {
  tarIuProduct: number;
  description: string;
  url: string;
  hashtag: string[];
  category: string[];
  totalLike: number;
  totalDislike: number;
  createdAt: Date;
};

export type ListPostFolderType = {
  folderName: string;
};
