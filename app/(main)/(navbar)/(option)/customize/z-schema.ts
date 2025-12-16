import { AlphaNumSpaceRegex } from "@/_util/Regex";
import { z } from "zod";

export const ProfileSchema = z.object({
  username: z.string().refine((val) => val.match(AlphaNumSpaceRegex()), {
    message: `* Invalid character`,
  }),
  biodata: z.string().nullable().optional(),
  location: z
    .string()
    .refine((val) => val.match(AlphaNumSpaceRegex()), {
      message: `* Invalid character`,
    })
    .nullable()
    .optional(),
  socialLink: z
    .array(
      z.object({
        platform: z.string().optional(),
        link: z.string().optional(),
      })
    )
    .transform((links) => links.filter((s) => s.link.trim() !== ""))
    .optional(),
  gender: z.string().nullable().optional(),
  phoneNumber: z.string().max(13, "* Max 13").nullable().optional(),
  currentPicture: z.string().optional(),
  picture: z.any().nullable().optional(),
});
