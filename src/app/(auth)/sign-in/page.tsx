"use client";

import { GithubSignIn } from "../../components/GithubSignIn/GithubSignIn";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./signin.module.scss";
import { GoogleSignIn } from "@/app/components/GoogleSignIn/GoogleSignIn";
import SignInForm from "./components/SignInForm";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();

  console.log(session);

  if (session) redirect("/");

  return (
    <div className={styles.fullHeight}>
      <div className={styles.signinContainer}>
        <h1 className={styles.signinTitle}>Sign In</h1>

        {/* <GithubSignIn />
        <GoogleSignIn /> */}

        <div className={styles.divider}>
          <div className={styles.dividerLine}>
            <span className={styles.dividerBorder} />
          </div>
          <div className={styles.dividerText}>
            <span className={styles.dividerLabel}>Or continue with email</span>
          </div>
        </div>
        <SignInForm />
        <div className={styles.signupLink}>
          <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
