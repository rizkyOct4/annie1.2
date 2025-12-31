export type TAllCreators = {
  public_id: string;
  created_at: Date;
  username: string;
  picture: string | undefined;
}[];

export interface TTargetCreatorsDescription {
  public_id: string;
  username: string | null;
  biodata: string | null;
  gender: string | null;
  phone_number: number | null;
  location: string | null;
  picture: string | null;
  social_link: string[];
  created_at: Date
  total_photo: number;
  total_video: number
}

// ? PHOTO
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

// ? VIDEO
export type TListCreatorVideo = {
  id_product: number;
  description: string;
  url: string;
  thumbnail_url: string;
  duration: number;
  hashtag: string[];
  category: string[];
  created_at: Date,
  total_like: number;
  total_dislike: number;
  status: string | null;
}[];
