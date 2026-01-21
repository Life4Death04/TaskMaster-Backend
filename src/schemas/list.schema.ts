import { z } from "zod";
import { colorHexSchema } from "./common.js";

export const createListSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().max(50).optional(),
  color: colorHexSchema.default("#000000"),
});

export const updateListSchema = z
  .object({
    title: z.string().min(1).max(50).optional(),
    description: z.string().max(50).optional(),
    color: colorHexSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
