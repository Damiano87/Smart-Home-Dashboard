"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./RoomSelect.module.scss";

export default function RoomSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    const room = e.target.value;
    if (room === "all") {
      params.delete("room");
    } else {
      params.set("room", room);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <form>
      <label htmlFor="room" className={styles.label}>
        Choose room:{" "}
      </label>
      <select
        id="room"
        name="room"
        value={searchParams.get("room") ?? "all"}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="all">All</option>
        <option value="salon">Living room</option>
        <option value="kuchnia">Kitchen</option>
        <option value="sypialnia">Bedroom</option>
      </select>
    </form>
  );
}
