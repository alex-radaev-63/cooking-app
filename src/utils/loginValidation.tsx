import { z } from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, "Please enter your login")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password"),
});
