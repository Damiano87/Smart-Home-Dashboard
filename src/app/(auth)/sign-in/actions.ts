"use server";

import { signIn } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export type SignInState = {
  error?: string;
  success?: boolean;
};

export async function signInAction(
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  try {
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid email or password" };
    }

    redirect("/");
  } catch (error) {
    // Jeśli to redirect, rzuć go dalej
    if (isRedirectError(error)) {
      throw error;
    }

    // Inne błędy obsłuż normalnie
    console.error("Sign in error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
