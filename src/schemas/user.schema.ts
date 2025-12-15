import { z } from "zod";

// User: register
export const registerSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.email(),
  password: z.string().min(8),
  profileImage: z.url().max(255).optional(),
});

// User: login
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

// User: update (partial)
export const updateUserSchema = z
  .object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    email: z.email().optional(),
    profileImage: z.url().max(255).optional(),
    phoneNumber: z.string().max(30).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
