"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signInSchema } from "@/lib/schema";
import { compare } from "bcrypt";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export type SignInState = {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

export async function signInAction(
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  try {
    // 1. Zod validation
    const validatedFields = signInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // 2. If validation fails return errors for each field
    if (!validatedFields.success) {
      return {
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    // 3. Check if user exists
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return {
        fieldErrors: {
          email: ["No account found with this email"],
        },
      };
    }

    // 4. Check password
    if (!user.password) {
      return {
        fieldErrors: {
          email: ["This account uses a different sign-in method"],
        },
      };
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return {
        fieldErrors: {
          password: ["Invalid password"],
        },
      };
    }

    // 4. Everything OK - Log in
    const result = await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid email or password" };
    }

    // 5. Redirect to home page
    redirect("/");
  } catch (error) {
    // if redirect error throw error
    if (isRedirectError(error)) {
      throw error;
    }

    // normal error handle
    console.log("Sign in error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
