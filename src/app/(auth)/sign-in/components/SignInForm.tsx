"use client";

import { signInWithCredentials } from "@/lib/actions";
import { useActionState } from "react";
import styles from "../signin.module.scss";
import { signIn } from "next-auth/react";

// const initialState = { success: false, error: "" };

const SignInForm = () => {
  // const [state, action, isPending] = useActionState(
  //   signInWithCredentials,
  //   initialState
  // );

  const credentialsAction = (formData: FormData) => {
    console.log(formData);

    signIn("credentials", formData);
  };

  return (
    <form className={styles.signinForm} action={credentialsAction}>
      {/* {state?.error && <p className="text-red-500">{state.error}</p>} */}
      <input
        name="email"
        placeholder="Email"
        type="email"
        required
        autoComplete="email"
        className={styles.input}
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        required
        autoComplete="current-password"
        className={styles.input}
      />
      <button className={styles.fullWidth} onClick={() => signIn()}>
        Sign in
      </button>
    </form>
  );
};
export default SignInForm;
