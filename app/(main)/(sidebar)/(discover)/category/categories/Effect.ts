import React, { useEffect } from "react";
import { DEFAULT_FETCH_SPESIFIC_CATEGORIES } from "../../../../types/aside/discover/categories/Default";
import { IdUniqueSubCommentProps } from "../../../../types/aside/discover/categories/Interface";

interface isFetchingSpesificProductProps {
  setIdProductSpesific: Function;
  idUniqueProduct: number | null;
  categoryName: string | null;
  creatorIdUnique: number | null;
}

export const isFetchingSpesificProduct = ({
  setIdProductSpesific,
  idUniqueProduct,
  categoryName,
  creatorIdUnique,
}: isFetchingSpesificProductProps) => {
  const categories = categoryName?.replace(/-/g, " ");
  useEffect(() => {
    if (setIdProductSpesific) {
      setIdProductSpesific({
        idUniqueProduct: idUniqueProduct,
        categories: categories,
        creatorIdUnique: creatorIdUnique,
      });
    }
    return () => {
      setIdProductSpesific({ ...DEFAULT_FETCH_SPESIFIC_CATEGORIES });
    };
  }, []);
  return null;
};

interface isFetchingSpesificCommentProps {
  idUniqueProduct: number | null;
  setIdUniqueProductComment: (idUniqueProductComment: number | null) => void;
}

export const isFetchingSpesificComment = ({
  idUniqueProduct,
  setIdUniqueProductComment,
}: isFetchingSpesificCommentProps) => {
  useEffect(() => {
    if (setIdUniqueProductComment) {
      setIdUniqueProductComment(idUniqueProduct);
    }
    return () => setIdUniqueProductComment(null);
  }, []);
  return null;
};

interface isFetchingSubSpesificCommentProps {
  parentCreatorIdUnique: number | null;
  idUniqueCm: number | null;
  setSubSpesificComment: React.Dispatch<
    React.SetStateAction<IdUniqueSubCommentProps>
  >;
}

export const isFetchingSubSpesificComment = ({
  parentCreatorIdUnique,
  idUniqueCm,
  setSubSpesificComment,
}: isFetchingSubSpesificCommentProps) => {
  useEffect(() => {
    if (setSubSpesificComment) {
      setSubSpesificComment({
        parentCreatorIdUnique: parentCreatorIdUnique,
        idUniqueCm: idUniqueCm,
      });
    }
    return () =>
      setSubSpesificComment({
        parentCreatorIdUnique: null,
        idUniqueCm: null,
      });
  }, []);
  return null;
};
