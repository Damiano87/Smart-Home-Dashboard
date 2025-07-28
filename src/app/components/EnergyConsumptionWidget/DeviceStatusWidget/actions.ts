import { prisma } from "@/lib/prisma";

export interface DeviceStatus {
  online: number;
  offline: number;
  total: number;
}

export async function getDeviceStatus(): Promise<DeviceStatus> {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const homes = await prisma.home.findMany({
    // where: { userId },
    include: {
      rooms: {
        include: {
          devices: true,
        },
      },
    },
  });

  let online = 0;
  let offline = 0;

  homes.forEach((home) => {
    home.rooms.forEach((room) => {
      room.devices.forEach((device) => {
        if (device.lastSeen > fifteenMinutesAgo && device.isActive) {
          online++;
        } else {
          offline++;
        }
      });
    });
  });

  return {
    online,
    offline,
    total: online + offline,
  };
}
