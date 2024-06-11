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
    .min(3, { message: "Password must be at least 8 characters." }),
});

export const PostValidation = z.object({
  content: z
    .string()
    .min(5, { message: "Minimum 5 characters." })
    .max(2200, { message: "Maximum 2,200 caracters" }),
  hashtags: z.string(),
  mentions: z.array(z.string()).optional(),
  image: z.any(),
});

export const ProfileValidation = z.object({
  fullname: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
  imageUrl: z.any(),
});
