import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForbiddenRegex } from "@/_util/Regex";


// * ZOD OBJECT
export const zEmailFormSchema = z.object({
  subject: z
    .string()
    .max(30, "Max 30 characters")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `Invalide character`,
    }),
  message: z
    .string()
    .max(80, "Max 80 characters")
    .refine((val) => !val.match(ForbiddenRegex()), {
      message: `Invalide character`,
    }),
});
