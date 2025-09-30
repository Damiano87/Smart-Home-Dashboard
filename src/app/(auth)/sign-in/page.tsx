import { redirect } from "next/navigation";
import styles from "./signin.module.scss";
import SignInForm from "./components/SignInForm";
import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();

  if (session) redirect("/");

  return (
    <div className={styles.fullHeight}>
      <div className={styles.signinContainer}>
        <h1 className={styles.signinTitle}>Sign In</h1>

        {/* <GithubSignIn />
        <GoogleSignIn /> */}

        {/* <div className={styles.divider}>
          <div className={styles.dividerLine}>
            <span className={styles.dividerBorder} />
          </div>
          <div className={styles.dividerText}>
            <span className={styles.dividerLabel}>Or continue with email</span>
          </div>
        </div> */}
        <SignInForm />
      </div>
    </div>
  );
};

export default Page;
