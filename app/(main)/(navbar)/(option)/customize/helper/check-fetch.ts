"use client";

import { useQueryClient } from "@tanstack/react-query";

export const CheckData = ({ queryKey }: any) => {
  const queryClient = useQueryClient();
  const data: boolean = !!queryClient.getQueryData(queryKey);
  return { data };
};
