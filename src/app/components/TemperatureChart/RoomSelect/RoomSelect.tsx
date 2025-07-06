"use client";

import { RoomType } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";

export default function RoomSelector({
  selectedRoom,
}: {
  selectedRoom: RoomType;
}) {
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
      <label htmlFor="room">Wybierz pokój: </label>
      <select
        id="room"
        name="room"
        value={selectedRoom}
        onChange={handleChange}
      >
        <option value="all">Wszystkie</option>
        <option value="salon">Salon</option>
        <option value="kuchnia">Kuchnia</option>
        <option value="sypialnia">Sypialnia</option>
      </select>
    </form>
  );
}
