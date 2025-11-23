export type ListFolderType = {
  folderName: string;
  totalProduct: number;
};
export type OriginalListFolderType = {
  data: ListFolderType[];
  hasMore: boolean;
};

// ? 2
export type ItemFolderType = {
  tarIuProduct: number;
  url: string;
};
export type OriginaItemFolderType = {
  folderName: string;
  data: ItemFolderType[];
  hasMore: boolean;
};

// ? 3
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

// * CRUD
export type PutImageSchema = {
  iuProduct: number;
  publicId: number;
  description: string;
  imageName: string;
  imagePath: string;
  prevImage: string;
  hashtag: string[];
  category: string[];
  type: string;
  createdAt: Date;
};
