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

export const createMessageSchema = z.object({
  message: z.string().min(1, {
    message: "The message field is required.",
  }),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, {
    message: "The name field must be at least 2 characters long.",
  }),
  image: z.string().min(1, {
    message: "The image field is required.",
  }),
  birthdate: z.date().min(new Date("1900-01-01"), {
    message: "Please enter a valid birthdate.",
  }),
  location: z.string().min(1, {
    message: "The location field is required.",
  }),
  occupation: z.string().min(1, {
    message: "The occupation field is required.",
  }),
  bio: z
    .string()
    .min(1, {
      message: "The bio field is required.",
    })
    .max(300, {
      message: "The bio field must be less than 300 characters long.",
    }),
});

export const setupAccountSchema = z.object({
  name: z.string().min(2, {
    message: "The name field must be at least 2 characters long.",
  }),
  image: z.string().min(1, {
    message: "The image field is required.",
  }),
  email: z
    .string()
    .email({ message: "Please enter a valid email." })
    .min(1, { message: "The email field is required." }),
  birthdate: z.date().min(new Date("1900-01-01"), {
    message: "Please enter a valid birthdate.",
  }),
  country: z.object({
    value: z.string(),
    label: z.string(),
    flag: z.string(),
    latlang: z.array(z.number()),
    region: z.string(),
  }),
  city: z.string().min(1, {
    message: "The state field is required.",
  }),
  occupation: z.string().min(1, {
    message: "The occupation field is required.",
  }),
  bio: z
    .string()
    .min(1, {
      message: "The bio field is required.",
    })
    .max(300, {
      message: "The bio field must be less than 300 characters long.",
    }),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type CreateMessageSchemaType = z.infer<typeof createMessageSchema>;
export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
export type SetupAccountSchemaType = z.infer<typeof setupAccountSchema>;
