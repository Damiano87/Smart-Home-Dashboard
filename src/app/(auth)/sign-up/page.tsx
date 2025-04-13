import { signUp } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GithubSignIn } from "../../components/GithubSignIn/GithubSignIn";
import { auth } from "@/lib/auth";
import styles from "./signup.module.scss";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className={styles.fullHeight}>
      <div className={styles.signupContainer}>
        <h1 className={styles.signupTitle}>Create Account</h1>

        <GithubSignIn />

        <div className={styles.divider}>
          <div className={styles.dividerLine}>
            <span className={styles.dividerBorder} />
          </div>
          <div className={styles.dividerText}>
            <span className={styles.dividerLabel}>Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Sign Up */}
        <form
          className={styles.signupForm}
          action={async (formData) => {
            "use server";
            const res = await signUp(formData);
            if (res.success) {
              redirect("/sign-in");
            }
          }}
        >
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
            autoComplete="new-password"
            className={styles.input}
          />
          <button className={styles.fullWidth} type="submit">
            Sign Up
          </button>
        </form>

        <div className={styles.signinLink}>
          <Link href="/sign-in">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
