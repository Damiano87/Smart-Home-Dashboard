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

// temperature sensor data types
export type TempSensorData = {
  co2: number | null;
  device: Device;
  deviceId: string;
  humidity: number | null;
  id: string;
  power: number | null;
  temperature: number | null;
  timestamp: Date;
  airQuality: number;
  noiseLevel: number;
};

type Device = {
  id: string;
  isActive: boolean;
  lastSeen: Date;
  name: string;
  room: Room;
  roomId: string;
  status: string;
  type: string;
};

type Room = {
  area: number | null;
  floor: number | null;
  homeId: string;
  id: string;
  name: string;
};

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
