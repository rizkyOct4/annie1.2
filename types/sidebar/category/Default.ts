import {
  SelectedImageState,
  SelectedReportState,
  SpesificCategoriesState,
  SelectedCommentState,
  SelectedShareState,
} from "./Interface";

export const DEFAULT_SELECTED_IMAGE: SelectedImageState = {
  isOpen: false,
  creatorIdUnique: null,
  idUniqueProduct: null,
  description: "",
  imageUrl: "",
  createdAt: "",
  creator_picture: null,
};

export const DEFAULT_FETCH_SPESIFIC_CATEGORIES: SpesificCategoriesState = {
  creatorIdUnique: null,
  idUniqueProduct: null,
  categories: "",
};

export const DEFAULT_REPORT_STATE_CATEGORIES: SelectedReportState = {
  idUniqueProduct: null,
  creatorIdUnique: null,
};

export const DEFAULT_COMMENT_STATE_CATEGORIES: SelectedCommentState = {
  idUniqueProduct: null,
};

export const DEFAULT_SHARE_STATE_CATEGORIES: SelectedShareState = {
  imageUrl: "",
};
