"use server";

import { prisma } from "@/lib/prisma";

export async function getEnergyConsumption(dateString = "2025-08-06") {
  try {
    const energyCostPerKWh = 0.25;
    const targetDate = new Date(dateString);

    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const measurements = await prisma.sensorData.findMany({
      where: {
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        device: {
          include: {
            room: true,
          },
        },
      },
    });

    const energyByRoom: Record<string, number> = {};

    for (const m of measurements) {
      const roomName = m.device.room.name;
      energyByRoom[roomName] = (energyByRoom[roomName] || 0) + m.power;
    }

    const roomResults = Object.entries(energyByRoom).map(
      ([roomName, totalPower]) => ({
        roomName,
        totalPower: Number(totalPower.toFixed(3)),
        cost: Number((totalPower * energyCostPerKWh).toFixed(2)),
      })
    );

    const totalPower =
      roomResults.reduce((sum, r) => sum + r.totalPower, 0) / 1000;
    const totalCost = Number((totalPower * energyCostPerKWh).toFixed(2));

    return {
      date: dateString,
      rooms: roomResults,
      totalPower: Number(totalPower.toFixed(2)),
      totalCost,
    };
  } catch (error) {
    console.error("Error fetching energy consumption data:", error);
    throw new Error("Cannot fetch energy consumption data");
  }
}
