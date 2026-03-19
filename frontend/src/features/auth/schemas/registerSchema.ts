import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().min(1, "The email field is required.").email("Invalid email."),
  name: z.string().min(1, "The name field is required."),
  username: z.string().min(1, "The username field is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
