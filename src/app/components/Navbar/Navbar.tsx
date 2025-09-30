import { auth } from "@/lib/auth";
import styles from "./Navbar.module.scss";
import SignOutBtn from "./SignOutBtn/SignOutBtn";
import UserInfoDisplay from "./UserInfoDisplay/UserInfoDisplay";

const Navbar = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <div className={styles.navbar}>
      <UserInfoDisplay name={session?.user?.name} />
      <SignOutBtn />
    </div>
  );
};

export default Navbar;
