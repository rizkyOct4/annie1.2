

export type UserCheckT = {
  iu: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  public_id: string;
  created_at: Date;
};


export type OutputT = {
  id_unique: number;
  first_name: string;
  last_name: string;
  role: string;
  public_id: string;
  username: string;
  gender: string;
  pict_url: string;
  bio: string;
  location: string;
  phone_number: number;
  total_follower: number;
}

export type SocialLinkT = {
  platform: string;
  social_link: string;
};


