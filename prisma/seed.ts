import { prisma } from "../src/lib/prisma";

async function main() {
  // Tworzymy użytkownika
  const user = await prisma.user.create({
    data: {
      name: "Jan Kowalski",
      email: "jan@example.com",
      image: "https://i.pravatar.cc/150?img=5",
    },
  });

  // Dom użytkownika
  const home = await prisma.home.create({
    data: {
      name: "Dom Główny",
      location: "Kraków",
      userId: user.id,
    },
  });

  // Pokój - salon
  const room = await prisma.room.create({
    data: {
      name: "Salon",
      floor: 1,
      area: 25.5,
      homeId: home.id,
    },
  });

  // Czujnik temperatury
  const tempSensor = await prisma.device.create({
    data: {
      name: "Czujnik temperatury - Salon",
      type: "temperature_sensor",
      status: "online",
      isActive: true,
      lastSeen: new Date(),
      roomId: room.id,
    },
  });

  // Czujnik ruchu
  const motionSensor = await prisma.device.create({
    data: {
      name: "Czujnik ruchu - Salon",
      type: "motion_sensor",
      status: "online",
      isActive: true,
      lastSeen: new Date(),
      roomId: room.id,
    },
  });

  // Symulujemy dane pomiarowe z temperatury z ostatnich 24h (co godzinę)
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // każda godzina
    await prisma.sensorData.create({
      data: {
        deviceId: tempSensor.id,
        timestamp,
        temperature: 21 + Math.random() * 3,
        humidity: 35 + Math.random() * 10,
        co2: 350 + Math.floor(Math.random() * 50),
        power: 0.5 + Math.random() * 0.3,
      },
    });
  }

  // Dodajmy zdarzenie z czujnika ruchu
  await prisma.deviceEvent.create({
    data: {
      deviceId: motionSensor.id,
      timestamp: new Date(),
      type: "motion_detected",
      details: {
        location: "Salon",
        intensity: Math.random(),
      },
    },
  });

  console.log("Zakończono seedowanie 🎉");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
