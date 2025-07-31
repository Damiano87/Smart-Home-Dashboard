import { prisma } from "@/lib/prisma";

export interface TemperatureData {
  average: number;
  min: number;
  max: number;
  roomCount: number;
}

export async function getAverageTemperature(): Promise<TemperatureData> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const homes = await prisma.home.findMany({
    // where: { userId },
    include: {
      rooms: {
        include: {
          devices: {
            where: { type: "temperature_sensor" },
            include: {
              data: {
                where: {
                  timestamp: { gte: oneDayAgo },
                  temperature: { not: null },
                },
                orderBy: { timestamp: "desc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const temperatures: number[] = [];
  let roomCount = 0;

  homes.forEach((home) => {
    home.rooms.forEach((room) => {
      const tempSensors = room.devices.filter(
        (device) =>
          device.type === "temperature_sensor" && device.data.length > 0
      );

      if (tempSensors.length > 0) {
        roomCount++;
        const latestTemp = tempSensors[0].data[0].temperature;
        if (latestTemp) temperatures.push(latestTemp);
      }
    });
  });

  if (temperatures.length === 0) {
    return { average: 0, min: 0, max: 0, roomCount: 0 };
  }

  const average =
    temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
  const min = Math.min(...temperatures);
  const max = Math.max(...temperatures);

  return {
    average: Math.round(average * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    roomCount,
  };
}
