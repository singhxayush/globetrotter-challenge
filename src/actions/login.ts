"use server";

import {loginSchema} from "@/app/schemas";
import {signIn} from "@/auth";
import {getUserByEmail} from "@/data/user";
// import {generateVerificationToken} from "@/lib/tokens";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {error: "Invalid fields!", success: ""}; // ✅ Ensure success exists
  }

  const {email, password} = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {error: "Email doesn't exist"};
  }

  // if (!existingUser.emailVerified) {
  //   const verificationToken = await generateVerificationToken(
  //     existingUser.email
  //   );

  //   return {success: "Confirmation email sent"};
  // }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return {error: "", success: "Login successful!"};
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {error: "Invalid credentials", success: ""};
        default:
          return {error: "Something went wrong", success: ""};
      }
    }

    throw error;
  }
};
