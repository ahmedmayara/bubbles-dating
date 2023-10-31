import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).min(1, {
    message: "The email field is required.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .min(1, {
      message: "The password field is required.",
    }),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, {
      message: "The name field must be at least 2 characters long.",
    }),
    email: z
      .string()
      .email({ message: "Please enter a valid email." })
      .min(1, { message: "The email field is required." }),
    password: z
      .string()
      .min(1, { message: "The password field is required." })
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z.string().min(1, {
      message: "The confirm password field is required.",
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The password and confirm password fields must match.",
        path: ["confirmPassword"],
      });
    }
  });

export type SignInSchemaType = z.infer<typeof signInSchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const interests = [
  {
    id: 1,
    name: "Exercise",
    chosen: true,
  },
  {
    id: 2,
    name: "Photography",
    chosen: true,
  },
  {
    id: 3,
    name: "Traveling",
    chosen: true,
  },
  {
    id: 4,
    name: "Art",
    chosen: false,
  },
  {
    id: 5,
    name: "Dancing",
    chosen: false,
  },
];
