export type CategoriesType = {
  creator_id_unique: number;
  id_unique_product: number;
  creator_picture: string | null;
  description: string;
  image_url: string;
  status_read: number | null;
  created_at: string;
};

export type CategoriesTypesData = CategoriesType[];

export type SpesificCategoriesTypes = {
  creator_id_unique: number;
  id_unique_product: number;
  total_like: number;
  total_dislike: number;
  total_read: number;
  total_comment: number;
  status_follow: number;
  bookmark_status: number;
};

export type SpesificCategoriesTypesData = SpesificCategoriesTypes[];

// * SPESIFIC COMMENT PARENT ======
export type SpesificCommentTypes = {
  creator_id_unique: number;
  first_name: string;
  id_unique_cm: number;
  text: string;
  pict_url: string | null;
  other_reply: number;
};

export type SpesificCommentTypesData = SpesificCommentTypes[];

// * SPESIFIC SUB COMMENT CHILD ======
export type SpesificSubCommentTypes = {
  id_unique_sub_cm: number;
  receiver_first_name: string;
  receiver_id_unique: number;
  sender_first_name: string;
  sender_id_unique: number;
  sender_pict_url: null | string;
  text: string;
  status: number
};

export type SpesificSubCommentTypesData = SpesificSubCommentTypes[]

// * REPORT POST ======
export type PostReportImageTypes = {
  id_unique_report: number;
  creator_id_unique: number | null;
  disc_id_post_report: null | number;
  image_id_post_report: null | number;
  type_post_report: string;
  status: string;
  text_report: string;
  created_at: string;
};

// * BOOKMARK POST OR DEL ======
export type PostOrDelBookmarkTypes = {
  ref_id_u_product: number;
  status: number;
  created_at: string;
  actionType: string;
};

// * FOlLOW POST OR DEL ======
export type PostOrDelFollowTypes = {
  id_unique_product: number;
  receiver_creator_id_unique: number;
  status_follow: number;
  update_at: string;
  actionType: string;
};

// * POST NEW COMMENT ======
export type PostNewCommentTypes = {
  ref_id_u_product: number | null;
  id_unique_cm: number;
  text: string;
  created_at: string;
};
