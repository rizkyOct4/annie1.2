import { z } from "zod";
import { ForbiddenRegex } from "@/_util/Regex";

export const zPostFormSchema = z.object({
  imageName: z.string(),
  imagePath: z.string(),
  description: z
    .string()
    .max(30, "Max 30 characters")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `invalid character`,
    }),
  folderName: z
    .string()
    .max(20, "Max 20 Characters")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `invalid character`,
    }),
  hashtag: z
    .array(
      z
        .string()
        .max(20, "Max 20 Characters")
        .refine((val) => !val.match(ForbiddenRegex()), {
          message: `invalid character`,
        })
    )
    .max(3, "Max 3 hashtags"),
  category: z.array(z.string()).max(3, "Max 3 category"),
});
