"use client";

import styles from "../signin.module.scss";
import { signInAction, SignInState } from "../actions";
import { useActionState } from "react";

const initialState: SignInState = {};

const SignInForm = () => {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  return (
    <form className={styles.signinForm} action={formAction}>
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <div className={styles.inputGroup}>
        <input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
          className={`${styles.input} ${
            state?.fieldErrors?.email ? styles.inputError : ""
          }`}
          disabled={isPending}
        />
        {state?.fieldErrors?.email && (
          <p className={styles.fieldError}>{state.fieldErrors.email[0]}</p>
        )}
      </div>
      <div className={styles.inputGroup}>
        <input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="current-password"
          className={`${styles.input} ${
            state?.fieldErrors?.password ? styles.inputError : ""
          }`}
          disabled={isPending}
        />
        {state?.fieldErrors?.password && (
          <p className={styles.fieldError}>{state.fieldErrors.password[0]}</p>
        )}
      </div>
      <SubmitButton isPending={isPending} />
    </form>
  );
};

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <button className={styles.fullWidth} type="submit" disabled={isPending}>
      {isPending ? (
        <>
          <span className={styles.spinner}></span>
          Signing in...
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

export default SignInForm;
