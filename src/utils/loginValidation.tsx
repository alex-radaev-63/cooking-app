import { z } from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, "Please enter your login")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
