import Image from "next/image";
import styles from "../Navbar.module.scss";

const Avatar = ({ image }: { image?: string | null }) => {
  if (!image) return null;

  return (
    <div className={styles.avatarWrapper}>
      <Image
        src={image}
        alt="Avatar"
        fill
        sizes="40px"
        className={styles.avatar}
      />
    </div>
  );
};
export default Avatar;
