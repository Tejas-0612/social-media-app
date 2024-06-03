import * as z from "zod";

export const SignUpValidation = z.object({
  fullname: z
    .string()
    .min(4, { message: "fullname must be atleast 4 characters" }),
  username: z
    .string()
    .min(4, { message: "username must be atleast 4 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const SignInValidation = z.object({
  username: z
    .string()
    .min(4, { message: "username must be atleast 4 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});
