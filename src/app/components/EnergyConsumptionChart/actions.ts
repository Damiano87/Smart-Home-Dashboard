import { prisma } from "@/lib/prisma";

export async function getEnergyConsumptionData() {
  try {
    // get data from SensorData collection
    const sensorData = await prisma.sensorData.findMany({
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
        timestamp: "asc",
      },
      // optional
      // where: {
      //   timestamp: {
      //     gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // last 24h
      //   }
      // }
    });

    // group data by hours and rooms
    const groupedData = sensorData.reduce((acc, record) => {
      const hour = new Date(record.timestamp).getHours();
      const timeKey = `${hour.toString().padStart(2, "0")}:00`;
      const roomName = record.device.room.name
        .toLowerCase()
        .replace(/\s+/g, "");

      if (!acc[timeKey]) {
        acc[timeKey] = { time: timeKey };
      }

      // if data exists for this hour and room add following
      if (acc[timeKey][roomName]) {
        acc[timeKey][roomName] += record.power || 0;
      } else {
        acc[timeKey][roomName] = record.power || 0;
      }

      return acc;
    }, {} as Record<string, any>);

    // convert to array and sort by time
    const chartData = Object.values(groupedData).sort((a: any, b: any) => {
      const timeA = parseInt(a.time.split(":")[0]);
      const timeB = parseInt(b.time.split(":")[0]);
      return timeA - timeB;
    });

    return chartData;
  } catch (error) {
    console.error("Error fetching energy consumption data:", error);
    return [];
  }
}
