"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse, RoomType, TempSensorData } from "@/types/types";

export const getTemperatureDataByRoom = async (
  roomType: RoomType
): Promise<ApiResponse<TempSensorData[]>> => {
  try {
    const baseQuery = {
      where: {
        device: {
          type: "temperature_sensor",
          ...(roomType !== "all" && {
            room: {
              name: {
                equals: roomType,
                mode: "insensitive" as const,
              },
            },
          }),
        },
      },
      include: {
        device: {
          include: {
            room: true,
          },
        },
      },
      orderBy: {
        timestamp: "asc" as const,
      },
    };

    const data = await prisma.sensorData.findMany(baseQuery);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    return { success: false, error: "Nie udało się pobrać danych temperatury" };
  }
};

// get last 24 hours
export const getLast24hTemperatureDataByRoom = async (roomType: RoomType) => {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const baseQuery = {
      where: {
        timestamp: {
          gte: twentyFourHoursAgo,
        },
        device: {
          type: "temperature_sensor",
          ...(roomType !== "all" && {
            room: {
              name: {
                equals: roomType,
                mode: "insensitive" as const,
              },
            },
          }),
        },
      },
      include: {
        device: {
          include: {
            room: true,
          },
        },
      },
      orderBy: {
        timestamp: "asc" as const,
      },
    };

    const data = await prisma.sensorData.findMany(baseQuery);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching last 24h temperature data:", error);
    return {
      success: false,
      error: "Nie udało się pobrać danych temperatury z ostatnich 24h",
    };
  }
};
