// * LIST FOLDER
export type ListFolderType = {
  folder_name: string;
  created_at: Date;
  total_product: number;
};

// export type ItemFolderType = {
//   tar_iu_product: number;
//   description: string;
//   image_name: string;
//   url: string;
//   hashtag: string[];
//   category: string[];
//   tar_iu: number;
//   iu_product: number;
//   type: string;
//   folder_name: string;
//   status: boolean;
//   created_at: Date;
// };
export type ItemFolderType = {
  tar_iu_product: number;
  url: string;
};

export type ItemFolderDescriptionType = {
  tar_iu_product: number;
  description: string;
  url: string;
  hashtag: string[];
  category: string[];
  total_like: number;
  total_dislike: number;
  created_at: Date;
};

export type ResultGetPostDB = {
  tar_iu_product: number;
  url: string;
};
