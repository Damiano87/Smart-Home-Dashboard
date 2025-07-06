export interface TemperatureData {
  id: string;
  value: number;
  timestamp: Date;
  device: {
    id: string;
    name: string;
    type: string;
    room: {
      id: string;
      name: string;
    } | null;
  };
}

export type RoomType = "all" | "salon" | "kuchnia" | "sypialnia";

export const ROOM_OPTIONS = [
  { value: "all" as const, label: "Wszystkie pomieszczenia" },
  { value: "salon" as const, label: "Salon" },
  { value: "kuchnia" as const, label: "Kuchnia" },
  { value: "sypialnia" as const, label: "Sypialnia" },
] as const;
