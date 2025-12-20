import { z } from "zod";
import { ForbiddenRegex } from "@/_util/Regex";

export type TImagePost = {
  idProduct: number;
  description: string;
  imageName: string;
  imagePath: string;
  hashtag: string[];
  category: string[];
  type: string;
  folderName: string;
  createdAt: Date;
};

export type TImagePut = {
  idProduct: number;
  description: string;
  imageName: string;
  imagePath: string;
  prevImage: string;
  folderName: string;
  hashtag: string[];
  category: string[];
  type: string;
  updatedAt: Date;
};

export const zPostFormSchema = z.object({
  imageName: z.string(),
  imagePath: z.string(),
  description: z
    .string()
    .max(40, "* Max 40 characters")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `* Invalid character`,
    }),
  folderName: z
    .string()
    .max(20, "* Max 20 Characters")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `* Invalid character`,
    }),
  hashtag: z
    .array(
      z
        .string()
        .max(20, "Max 20 Characters")
        .refine((val) => !val.match(ForbiddenRegex()), {
          message: `* invalid character`,
        })
    )
    .max(3, "Max 3 hashtags"),
  category: z.array(z.string()).max(3, "Max 3 category"),
});

export const zPutFormSchema = z.object({
  imageName: z.string(),
  imagePath: z.string(),
  prevImage: z.string(),
  folderName: z
    .string()
    .max(20, "* Max 20 Characters")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `* Invalid character`,
    }),
  description: z
    .string()
    .max(30, "* Max 30 characters")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `* Invalid character`,
    }),
  hashtag: z
    .array(
      z
        .string()
        .max(20, "* Max 20 Characters")
        .refine((val) => !val.match(ForbiddenRegex()), {
          message: `* Invalid character`,
        })
    )
    .max(3, "* Max 3 hashtags"),
  category: z.array(z.string()).max(3, "* Max 3 category"),
});
