"use server";

import { prisma } from "@/lib/prisma";

/**
 * Data type required by the AirConditionerWidget component.
 */
export type AirConditionerData = {
  id: string;
  roomName: string;
  isOnline: boolean;

  mode: string;
  currentTemp: number | null;
  targetTemp: number | null;
  temperatureDiff: number;

  fanSpeed: string;
  swing: boolean;
  ecoMode: boolean;
  sleepMode: boolean;

  timerOn?: Date | null;
  timerOff?: Date | null;
};

/**
 * Determines if the device is online.
 * Uses the `status` field from Device (online/offline),
 * and falls back to `lastSeen` timestamp if needed.
 */
const isDeviceOnline = (status: string, lastSeen: Date): boolean => {
  if (status.toLowerCase() === "online") return true;

  const HEARTBEAT_MS = 5 * 60 * 1000;
  return new Date().getTime() - lastSeen.getTime() < HEARTBEAT_MS;
};

/**
 * Fetches all air conditioners with their associated devices and rooms,
 * and maps the data into a format required by the UI.
 */
export async function getAirConditioners(): Promise<AirConditionerData[]> {
  try {
    const items = await prisma.airConditioner.findMany({
      include: {
        device: {
          include: {
            room: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return items.map((ac) => {
      const roomName = ac.device?.room?.name ?? "Unknown room";

      const diff =
        ac.currentTemp != null && ac.targetTemp != null
          ? Math.abs(ac.currentTemp - ac.targetTemp)
          : 0;

      const temperatureDiff = diff < 0.05 ? 0 : Math.round(diff * 10) / 10;

      const isOnline = isDeviceOnline(ac.device.status, ac.device.lastSeen);

      return {
        id: ac.id,
        roomName,
        isOnline,

        mode: ac.mode,
        currentTemp: ac.currentTemp,
        targetTemp: ac.targetTemp,
        temperatureDiff,

        fanSpeed: ac.fanSpeed,
        swing: ac.swing,
        ecoMode: ac.ecoMode,
        sleepMode: ac.sleepMode,

        timerOn: ac.timerOn,
        timerOff: ac.timerOff,
      } satisfies AirConditionerData;
    });
  } catch (error) {
    console.error(
      "[getAirConditioners] Error while fetching air conditioners:",
      error
    );
    return []; // safe fallback for the UI
  }
}
