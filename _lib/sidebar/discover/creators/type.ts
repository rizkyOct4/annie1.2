export type CreatorsType = {
  first_name: string;
  last_name: string;
  public_id: string;
  created_at: Date;
  username: string | undefined;
  picture: string | undefined;
};

export interface CreatorDescriptionType {
  first_name: string;
  last_name: string;
  username: string | null;
  biodata: string | null;
  gender: string | null;
  picture: string | null;
  social_link: string[];
}

export interface ListCreatorProductType {
  tar_iu_product: number;
  description: string;
  url: string;
  hashtag: string[];
  category: string[];
  created_at: Date;
  total_like: number;
  total_dislike: number;
  status: boolean
}
