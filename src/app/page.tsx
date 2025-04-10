import Image from "next/image";
import styles from "./page.module.scss";
import { getUsers } from "./actions/userActions";

export default async function Home() {
  const { data, error } = await getUsers();

  if (error) {
    return <div>There was an error...</div>;
  }

  return (
    <div>
      {data?.map((user, index) => (
        <h1 key={index} className={styles.name}>
          {user.name}
        </h1>
      ))}
    </div>
  );
}
