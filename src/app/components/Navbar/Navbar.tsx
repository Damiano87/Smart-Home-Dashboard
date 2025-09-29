import { auth } from "@/lib/auth";
import styles from "./Navbar.module.scss";
import SignOutBtn from "./SignOutBtn/SignOutBtn";
import UserInfoDisplay from "./UserInfoDisplay/UserInfoDisplay";

const Navbar = async () => {
  const session = await auth();

  console.log("=== NAVBAR RENDER ===");
  console.log("Session in Navbar:", session);
  console.log("User:", session?.user);

  if (!session) {
    console.log("No session - returning null");
    return null;
  }

  console.log("Session exists - rendering navbar");

  return (
    <div className={styles.navbar}>
      <UserInfoDisplay name={session?.user?.name} />
      <SignOutBtn />
    </div>
  );
};
export default Navbar;
