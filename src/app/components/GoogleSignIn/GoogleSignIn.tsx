import { signIn } from "@/lib/auth";
import styles from "./page.module.scss";

const GoogleSignIn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button className={styles.btn}>Continue with Google</button>
    </form>
  );
};

export { GoogleSignIn };
