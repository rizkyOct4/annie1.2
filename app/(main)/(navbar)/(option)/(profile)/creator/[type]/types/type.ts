export type ListFolderType = {
  folderName: string;
  amountItem: number;
};
export type TOriginalListFolder = {
  data: ListFolderType[];
  hasMore: boolean;
};

// ? 2
export type ItemFolderType = {
  folderName: string;
  idProduct: number;
  url: string;
  createdAt: Date
};
export type TOriginalItemFolder = {
  data: ItemFolderType[];
  hasMore: boolean;
};

// ? 3
export type TOriginalUpdated = {
  idProduct: number;
  folderName: string;
  description: string;
  imageName: string;
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
