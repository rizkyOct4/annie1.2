import { z } from "zod";
import { ForbiddenRegex } from "@/_util/Regex";

export const zRegisterFormSchema = z.object({
  firstName: z
    .string()
    .max(20, "Max 20 character")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `Invalide character`,
    }),

  lastName: z
    .string()
    .max(20, "Max 20 character")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `Invalide character`,
    }),

  email: z.string().max(30, "Max 20 character"),
  password: z
    .string()
    .max(20, "Max 20 character")
    .refine((val) => !val.match(ForbiddenRegex())),
  role: z.string(),
});

export const zLoginFormSchema = z.object({
  email: z.string().max(30, "Max 30 characters"),
  password: z
    .string()
    .max(12, "Max 12 characters")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `invalid character`,
    }),
  // regex: z.string().refine((val) => !val.match(ForbiddenRegex())),
});
