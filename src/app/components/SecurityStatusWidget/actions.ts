import "server-only";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface SecurityStatus {
  status: "secure" | "warning" | "alert";
  totalMotionSensors: number;
  motionSensorsActive: number;
  recentEvents: number;
}

interface Sensor {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline";
  isActive: boolean;
  lastSeen: Date;
  roomId: string;
}

// Determines security status based on active motion sensors percentage
const calculateSecurityStatus = (
  activePercentage: number
): SecurityStatus["status"] => {
  if (activePercentage >= 80) return "secure";
  if (activePercentage >= 50) return "warning";
  return "alert";
};

// Checks if a sensor is considered active based on its status and last seen time
const isSensorActive = (sensor: Sensor): boolean => {
  if (!sensor.isActive || sensor.status === "offline") {
    return false;
  }

  // Consider sensor inactive if last seen more than 5 minutes ago
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return sensor.lastSeen > fiveMinutesAgo;
};

// Simulates recent motion detection events for demonstration
// In a real application, this would query an events/logs collection
const getRecentMotionEvents = async (
  activeSensorIds: string[]
): Promise<number> => {
  // This is a placeholder - in real implementation you would:
  // 1. Query motion events from the last hour
  // 2. Filter by active motion sensor IDs
  // 3. Return the count

  // For now, return a simulated value based on number of active sensors
  return Math.floor(Math.random() * activeSensorIds.length * 3);
};

// Retrieves security status based on motion sensors data
export async function getSecurityStatus(): Promise<SecurityStatus> {
  try {
    // Fetch all motion sensors from the database
    const motionSensors = (await prisma.device.findMany({
      where: {
        type: "motion_sensor",
      },
    })) as Sensor[];

    const totalMotionSensors = motionSensors.length;

    // Filter active motion sensors
    const activeSensors = motionSensors.filter(isSensorActive);
    const motionSensorsActive = activeSensors.length;

    // Calculate active percentage
    const activePercentage =
      totalMotionSensors > 0
        ? (motionSensorsActive / totalMotionSensors) * 100
        : 0;

    // Determine security status
    const status = calculateSecurityStatus(activePercentage);

    // Get recent motion events
    const activeSensorIds = activeSensors.map((sensor) => sensor.id);
    const recentEvents = await getRecentMotionEvents(activeSensorIds);

    return {
      status,
      totalMotionSensors,
      motionSensorsActive,
      recentEvents,
    };
  } catch (error) {
    console.error("Error fetching security status:", error);

    // Return safe defaults in case of error
    return {
      status: "alert",
      totalMotionSensors: 0,
      motionSensorsActive: 0,
      recentEvents: 0,
    };
  } finally {
    await prisma.$disconnect();
  }
}
