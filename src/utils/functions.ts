import { TempSensorData } from "@/types/types";

// convert raw temperature data to data suitable for the chart
export const processTemperatureData = (rawData: TempSensorData[]) => {
  // group data by timestamp
  const groupedByTime = rawData.reduce((acc, item) => {
    const timeKey = new Date(item.timestamp).toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!acc[timeKey]) {
      acc[timeKey] = {
        time: timeKey,
        timestamp: item.timestamp,
      };
    }

    // add temperature for room
    const roomName = item.device?.room?.name?.toLowerCase();
    if (roomName) {
      acc[timeKey][roomName] = item.temperature;
    }

    return acc;
  }, {} as Record<string, any>);

  // conver object into array and sort by time
  return Object.values(groupedByTime).sort(
    (a: any, b: any) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

// rename room names
export const renameRoom = (name: string | undefined) => {
  if (name === "Salon") return "Living room";
  if (name === "Kuchnia") return "Kitchen";
  if (name === "Sypialnia") return "Bedroom";
};
