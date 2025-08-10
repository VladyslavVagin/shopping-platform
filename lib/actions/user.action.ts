"use server";

import { signInFormSchema, signUpFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { signIn, signOut } from "@/auth";
import { FormatError } from "../utils";

// Sign Up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
      redirectTo: "/",
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // Re-throw redirect errors
    }
    return { success: false, message: FormatError(error) };
  }
}

// Sign in user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const credentials = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // Re-throw redirect errors
    }
    return { success: false, message: "Invalid credentials" };
  }
}

// Sign out user
export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
