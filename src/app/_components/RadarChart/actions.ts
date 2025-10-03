import { prisma } from "@/lib/prisma";
import { TempSensorData } from "@/types/types";

export async function getRadarChartData(): Promise<TempSensorData[]> {
  try {
    // get all unique deviceIds
    const uniqueDeviceIds = await prisma.sensorData.findMany({
      select: { deviceId: true },
      distinct: ["deviceId"],
    });

    // for each deviceId get unique document
    const latestDocuments = await Promise.all(
      uniqueDeviceIds.map(async ({ deviceId }) => {
        return await prisma.sensorData.findFirst({
          where: { deviceId },
          include: {
            device: {
              select: {
                room: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { timestamp: "desc" },
        });
      })
    );

    // filter out null values (if exist)
    return latestDocuments.filter((doc) => doc !== null) as TempSensorData[];
  } catch (error) {
    console.error("Error fetching latest documents:", error);
    throw new Error("Failed to fetch latest documents for each device");
  }
}
