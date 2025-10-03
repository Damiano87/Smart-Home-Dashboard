"use server";

import { prisma } from "@/lib/prisma";

export type TemperatureData = {
  average: number;
  min: number;
  max: number;
  roomCount: number;
  roomAverages: Array<{
    deviceId: string;
    roomName: string;
    averageTemperature: number;
  }>;
};

export async function getAverageTemperature(): Promise<TemperatureData> {
  try {
    // get global stats
    const globalStats = await prisma.sensorData.aggregate({
      _avg: {
        temperature: true,
      },
      _min: {
        temperature: true,
      },
      _max: {
        temperature: true,
      },
    });

    // get average data group by deviceId
    const deviceAverages = await prisma.sensorData.groupBy({
      by: ["deviceId"],
      _avg: {
        temperature: true,
      },
      _count: {
        deviceId: true,
      },
    });

    // get room info for each deviceId
    const devicesWithRooms = await prisma.device.findMany({
      where: {
        id: {
          in: deviceAverages.map((avg) => avg.deviceId),
        },
      },
      include: {
        room: true,
      },
    });

    // create map deviceId -> room name
    const deviceToRoomName = devicesWithRooms.reduce((acc, device) => {
      acc[device.id] = device.room?.name || `Room ${device.id}`;
      return acc;
    }, {} as Record<string, string>);

    // prepare data for each room
    const roomAverages = deviceAverages.map((avg) => ({
      deviceId: avg.deviceId,
      roomName: deviceToRoomName[avg.deviceId] || `Room ${avg.deviceId}`,
      averageTemperature: parseFloat((avg._avg.temperature || 0).toFixed(1)),
    }));

    return {
      average: parseFloat((globalStats._avg.temperature || 0).toFixed(1)),
      min: parseFloat((globalStats._min.temperature || 0).toFixed(1)),
      max: parseFloat((globalStats._max.temperature || 0).toFixed(1)),
      roomCount: deviceAverages.length,
      roomAverages,
    };
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    throw new Error("Failed to fetch temperature data");
  }
}
