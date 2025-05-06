"use client";

import { signInWithCredentials } from "@/lib/actions";
import { useActionState } from "react";
import styles from "../signin.module.scss";

const initialState = { success: false, error: "" };

const SignInForm = () => {
  const [state, action, isPending] = useActionState(
    signInWithCredentials,
    initialState
  );

  console.log(state);

  return (
    <form className={styles.signinForm} action={action}>
      {state?.error && <p className="text-red-500">{state.error}</p>}
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
      <button className={styles.fullWidth} type="submit">
        sign in
      </button>
    </form>
  );
};
export default SignInForm;
