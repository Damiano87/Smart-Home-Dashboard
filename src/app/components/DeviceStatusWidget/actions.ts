import { prisma } from "@/lib/prisma";

export interface DeviceStatus {
  total: number;
  online: number;
  offline: number;
}

export async function getDeviceStatus(): Promise<DeviceStatus> {
  try {
    // get all devices
    const devices = await prisma.device.findMany({
      select: {
        status: true,
        isActive: true,
      },
    });

    // count only active devices
    const activeDevices = devices.filter((device) => device.isActive);

    const total = activeDevices.length;
    const online = activeDevices.filter(
      (device) => device.status === "online"
    ).length;
    const offline = total - online;

    return {
      total,
      online,
      offline,
    };
  } catch (error) {
    console.error("Error fetching device status:", error);

    // return default values if error
    return {
      total: 0,
      online: 0,
      offline: 0,
    };
  }
}
