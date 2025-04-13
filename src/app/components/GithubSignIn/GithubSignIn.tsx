import { signIn } from "@/lib/auth";
import styles from "./page.module.scss";

const GithubSignIn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <button className={styles.btn}>Continue with GitHub</button>
    </form>
  );
};

export { GithubSignIn };
