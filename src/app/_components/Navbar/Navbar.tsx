import { auth } from "@/lib/auth";
import styles from "./Navbar.module.scss";
import SignOutBtn from "./SignOutBtn/SignOutBtn";
import UserInfoDisplay from "./UserInfoDisplay/UserInfoDisplay";
import Avatar from "./Avatar/Avatar";

const Navbar = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <div className={styles.navbar}>
      <Avatar image={session?.user?.image} />
      <div className={styles.flex}>
        <UserInfoDisplay name={session?.user?.name} />
        <SignOutBtn />
      </div>
    </div>
  );
};

export default Navbar;
