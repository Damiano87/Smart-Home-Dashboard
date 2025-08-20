export interface Room {
  id: string;
  name: string;
  floor?: number;
  area?: number;
  devices: Device[];
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline";
  isActive: boolean;
  lastSeen: Date;
  roomId: string;
  light?: Light;
}

export interface Light {
  id: string;
  deviceId: string;
  isOn: boolean;
  brightness: number;
  color?: string;
  dimming: boolean;
  colorTemp?: number;
  timerOn?: Date;
  timerOff?: Date;
}

export interface RoomWithLights extends Room {
  devices: Device[];
}
