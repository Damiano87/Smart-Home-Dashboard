import { signOut } from "@/lib/auth";
import styles from "../Navbar.module.scss";

const SignOutBtn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button className={styles.logoutBtn} type="submit">
        Sign Out
      </button>
    </form>
  );
};
export default SignOutBtn;
