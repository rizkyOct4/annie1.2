export type TAllCreators = {
  public_id: string;
  created_at: Date;
  username: string;
  picture: string | undefined
}[];

export interface TTargetCreatorsDescription {
  username: string | null;
  biodata: string | null;
  gender: string | null;
  phone_number: number | null;
  location: string | null;
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
  status: boolean;
}
