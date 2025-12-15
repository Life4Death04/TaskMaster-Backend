import { z } from "zod";
import {
  dateFormatEnum,
  languageEnum,
  priorityEnum,
  statusEnum,
  themeEnum,
} from "./common.js";

export const updateSettingsSchema = z
  .object({
    theme: themeEnum.optional(),
    dateFormat: dateFormatEnum.optional(),
    language: languageEnum.optional(),
    defaultPriority: priorityEnum.optional(),
    defaultStatus: statusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one settings field must be provided",
  });

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
