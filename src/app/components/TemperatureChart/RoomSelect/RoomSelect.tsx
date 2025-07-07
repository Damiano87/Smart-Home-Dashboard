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
        Wybierz pokój:{" "}
      </label>
      <select
        id="room"
        name="room"
        value={searchParams.get("room") ?? "all"}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="all">Wszystkie</option>
        <option value="salon">Salon</option>
        <option value="kuchnia">Kuchnia</option>
        <option value="sypialnia">Sypialnia</option>
      </select>
    </form>
  );
}
