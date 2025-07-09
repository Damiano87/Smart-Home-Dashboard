"use server";

import { prisma } from "@/lib/prisma";

// get device type for pie chart
export const getDeviceTypeDistribution = async () => {
  try {
    const deviceCounts = await prisma.device.groupBy({
      by: ["type"],
      _count: { type: true },
    });

    // Zwracamy w formacie przyjaznym do wykresu
    const deviceData = deviceCounts.map((item) => ({
      name: item.type,
      value: item._count.type,
    }));

    return deviceData;
  } catch (error) {
    console.error("Błąd podczas pobierania rozkładu urządzeń:", error);
    return [];
  }
};
