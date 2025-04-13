import { auth } from "@/lib/auth";
import { signIn } from "@/lib/auth";
import { GithubSignIn } from "../../components/GithubSignIn/GithubSignIn";
import { executeAction } from "../../../lib/executeAction";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./signin.module.scss";
import { GoogleSignIn } from "@/app/components/GoogleSignIn/GoogleSignIn";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className={styles.fullHeight}>
      <div className={styles.signinContainer}>
        <h1 className={styles.signinTitle}>Sign In</h1>

        <GithubSignIn />
        <GoogleSignIn />

        <div className={styles.divider}>
          <div className={styles.dividerLine}>
            <span className={styles.dividerBorder} />
          </div>
          <div className={styles.dividerText}>
            <span className={styles.dividerLabel}>Or continue with email</span>
          </div>
        </div>

        <form
          className={styles.signinForm}
          action={async (formData) => {
            "use server";
            await executeAction({
              actionFn: async () => {
                await signIn("credentials", formData);
              },
            });
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
            autoComplete="current-password"
            className={styles.input}
          />
          <button className={styles.fullWidth} type="submit">
            Sign In
          </button>
        </form>

        <div className={styles.signupLink}>
          <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
