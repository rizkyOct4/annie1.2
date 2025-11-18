import { z } from "zod";
import { ForbiddenRegex } from "@/_util/Regex";

export const zPostVideoFormSchema = z.object({
  videoName: z.string(),
  videoFile: z.instanceof(File).nullable(),
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
  hashtag: z.array(
    z
      .string()
      .max(20, "Max 20 Characters")
      .refine((val) => !val.match(ForbiddenRegex()), {
        message: `invalid character`,
      })
  ),
  category: z.array(z.string()).max(3, "Max 3 category"),
});
