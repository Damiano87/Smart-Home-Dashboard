import { prisma } from "@/lib/prisma";

export const getRadarChartData = async () => {
  try {
    const baseQuery = {
      include: {
        device: {
          include: {
            room: {
              select: {
                name: true,
              },
            },
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
    console.error("Error fetching radar chart data:", error);
    return { success: false, error: "Failed fetching radar chart data" };
  }
};
