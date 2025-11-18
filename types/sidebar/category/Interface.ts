export interface SelectedImageState {
  isOpen: boolean;
  creatorIdUnique: null | number;
  idUniqueProduct: number | null;
  description: string;
  imageUrl: string;
  createdAt: string;
  creator_picture: string | null;
}

export interface SelectedReportState {
  idUniqueProduct: null | number;
  creatorIdUnique: number | null;
}

export interface SelectedCommentState {
  idUniqueProduct: null | number;
}

export interface SelectedShareState {
  imageUrl: string;
}

export interface SpesificCategoriesState {
  creatorIdUnique: number | null;
  idUniqueProduct: number | null;
  categories: string;
}

export interface UpdateStatusCategoriesState {
  id_unique_product: number;
  categories: string;
  status_read: number;
  read_at: string;
}

export interface OtherReplyState {
  isOpen: boolean;
  idUniqueCm: null | number;
  parentCreatorIdUnique: null | number;
}

// * SUB COMMENT STATE
export interface IdUniqueSubCommentProps {
  parentCreatorIdUnique: null | number;
  idUniqueCm: null | number;
}

export interface SpesReplyStateTypes {
  replyReceiver: number | null;
  replyName: string;
  text: string;
  typeAction: string;
  idUniqueSubCm: null | number;
}

export interface PostSubCommentTypes {
  ref_id_u_receiver: number | null;
  ref_id_unique_cm: number | null;
  id_unique_sub_cm: number;
  text: string;
  created_at: string;
  status: number;
  type_action: string;
}

export interface UpdateSubCommentTypes {
  ref_id_u_receiver: number | null;
  ref_id_unique_cm: number | null;
  id_unique_sub_cm: number | null;
  text: string;
  created_at: string;
  status: number;
  type_action: string;
}
