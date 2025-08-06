import { prisma } from "@/lib/prisma";

async function main() {
  const deviceIds = [
    "67f552cfdee577dc1deded63", // Salon
    "6865962bb34a7cdc22795f69", // Sypialnia
    "686596bcb34a7cdc22795f6e", // Biuro
  ];

  const baseDate = new Date("2025-08-06T00:00:00.000Z");
  const data: any[] = [];

  deviceIds.forEach((deviceId, deviceIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(baseDate);
      timestamp.setUTCHours(hour);

      // różnice w pokojach
      const tempOffset = deviceIndex === 0 ? 0.5 : deviceIndex === 1 ? -0.3 : 0;
      const humidityOffset = deviceIndex === 2 ? 3 : deviceIndex === 1 ? -2 : 0;
      const noiseOffset = deviceIndex === 0 ? 2 : deviceIndex === 1 ? -1 : 0;

      // symulacja przebiegu dobowego
      const temperature =
        22 + tempOffset + Math.sin(((hour - 6) / 24) * 2 * Math.PI) * 1.2;
      const humidity =
        47 + humidityOffset + Math.sin(((hour + 6) / 24) * 2 * Math.PI) * 3;
      const co2 =
        600 +
        (hour < 6 || hour > 21 ? 200 : 0) +
        Math.sin(((hour + 3) / 24) * 2 * Math.PI) * 50;
      const power =
        hour >= 7 && hour <= 22
          ? 20 + Math.abs(Math.sin((hour / 24) * 2 * Math.PI) * 70)
          : 5;
      const airQuality =
        20 + Math.abs(Math.sin((hour / 24) * 2 * Math.PI) * 10);
      const noiseLevel =
        28 +
        noiseOffset +
        (hour >= 7 && hour <= 22
          ? Math.abs(Math.sin((hour / 24) * 2 * Math.PI) * 12)
          : 0);

      data.push({
        timestamp,
        deviceId,
        temperature: parseFloat(temperature.toFixed(1)),
        humidity: parseFloat(humidity.toFixed(1)),
        co2: Math.round(co2),
        power: parseFloat(power.toFixed(1)),
        airQuality: Math.round(airQuality),
        noiseLevel: Math.round(noiseLevel),
      });
    }
  });

  await prisma.sensorData.createMany({
    data,
  });

  console.log(`Inserted ${data.length} records into sensorData`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
