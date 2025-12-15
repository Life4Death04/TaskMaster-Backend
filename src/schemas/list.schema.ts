import { z } from "zod";
import { colorHexSchema, idSchema } from "./common.js";

export const createListSchema = z.object({
  title: z.string().min(1).max(50),
  color: colorHexSchema.default("#000000"),
  authorId: idSchema,
});

export const updateListSchema = z
  .object({
    id: idSchema,
    title: z.string().min(1).max(50).optional(),
    color: colorHexSchema.optional(),
  })
  .refine((data) => Object.keys(data).some((k) => k !== "id"), {
    message: "At least one field besides id must be provided",
    path: ["id"],
  });

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
