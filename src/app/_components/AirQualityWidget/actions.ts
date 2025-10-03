"use server";

import { prisma } from "@/lib/prisma";

// types for air quality data
export interface AirQualityData {
  averageCO2: number;
  averageHumidity: number;
  averageAirQuality: number;
  status: "good" | "moderate" | "poor";
}

export interface RoomAirQualityData extends AirQualityData {
  roomName: string;
  deviceId: string;
  lastUpdated: Date;
}

export interface AirQualityResponse extends AirQualityData {
  rooms: RoomAirQualityData[];
}

// constants for air quality thresholds
const AIR_QUALITY_THRESHOLDS = {
  CO2: {
    GOOD: 600,
    MODERATE: 1000,
  },
  AIR_QUALITY_INDEX: {
    GOOD: 50,
    MODERATE: 100,
  },
} as const;

// room mapping based on deviceId patterns
const ROOM_MAPPING = {
  room1: "Living Room",
  room2: "Kitchen",
  room3: "Bedroom",
} as const;

// determines air quality status based on CO2 and air quality index
function determineAirQualityStatus(
  co2: number,
  airQualityIndex: number
): "good" | "moderate" | "poor" {
  if (
    co2 <= AIR_QUALITY_THRESHOLDS.CO2.GOOD &&
    airQualityIndex <= AIR_QUALITY_THRESHOLDS.AIR_QUALITY_INDEX.GOOD
  ) {
    return "good";
  }

  if (
    co2 <= AIR_QUALITY_THRESHOLDS.CO2.MODERATE &&
    airQualityIndex <= AIR_QUALITY_THRESHOLDS.AIR_QUALITY_INDEX.MODERATE
  ) {
    return "moderate";
  }

  return "poor";
}

// gets room name based on device groups
function getRoomNameByIndex(index: number): string {
  if (index < 24) return ROOM_MAPPING.room1;
  if (index < 48) return ROOM_MAPPING.room2;
  return ROOM_MAPPING.room3;
}

// rounds number to specified decimal places
function roundToDecimal(num: number, decimals: number = 1): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// fetches and processes air quality data for all rooms
export async function getAirQuality(): Promise<AirQualityResponse> {
  try {
    // fetch all sensor data ordered by timestamp
    const sensorData = await prisma.sensorData.findMany({
      orderBy: {
        timestamp: "asc",
      },
      select: {
        deviceId: true,
        temperature: true,
        humidity: true,
        co2: true,
        airQuality: true,
        timestamp: true,
      },
    });

    if (sensorData.length === 0) {
      throw new Error("No sensor data found");
    }

    // group data by device (room)
    const deviceGroups = new Map<string, typeof sensorData>();

    sensorData.forEach((record, index) => {
      const roomName = getRoomNameByIndex(index);
      if (!deviceGroups.has(record.deviceId)) {
        deviceGroups.set(record.deviceId, []);
      }
      deviceGroups.get(record.deviceId)!.push({
        ...record,
        roomName,
      });
    });

    // process data for each room
    const roomsData: RoomAirQualityData[] = [];
    let totalCO2 = 0;
    let totalHumidity = 0;
    let totalAirQuality = 0;
    let totalRecords = 0;

    for (const [deviceId, records] of deviceGroups) {
      if (records.length === 0) continue;

      // calculate averages for this room
      const roomCO2 =
        records.reduce((sum, record) => sum + record.co2, 0) / records.length;
      const roomHumidity =
        records.reduce((sum, record) => sum + record.humidity, 0) /
        records.length;
      const roomAirQuality =
        records.reduce((sum, record) => sum + record.airQuality, 0) /
        records.length;

      // determine room status
      const roomStatus = determineAirQualityStatus(roomCO2, roomAirQuality);

      // get room name (use the first record's room name)
      const roomName = getRoomNameByIndex(
        sensorData.findIndex((r) => r.deviceId === deviceId)
      );

      // get latest timestamp for this room
      const lastUpdated = records[records.length - 1].timestamp;

      roomsData.push({
        roomName,
        deviceId,
        averageCO2: roundToDecimal(roomCO2),
        averageHumidity: roundToDecimal(roomHumidity),
        averageAirQuality: roundToDecimal(roomAirQuality),
        status: roomStatus,
        lastUpdated,
      });

      // add to overall totals
      totalCO2 += roomCO2 * records.length;
      totalHumidity += roomHumidity * records.length;
      totalAirQuality += roomAirQuality * records.length;
      totalRecords += records.length;
    }

    // calculate overall averages
    const overallAverageCO2 = totalRecords > 0 ? totalCO2 / totalRecords : 0;
    const overallAverageHumidity =
      totalRecords > 0 ? totalHumidity / totalRecords : 0;
    const overallAverageAirQuality =
      totalRecords > 0 ? totalAirQuality / totalRecords : 0;

    // determine overall status
    const overallStatus = determineAirQualityStatus(
      overallAverageCO2,
      overallAverageAirQuality
    );

    return {
      averageCO2: roundToDecimal(overallAverageCO2),
      averageHumidity: roundToDecimal(overallAverageHumidity),
      averageAirQuality: roundToDecimal(overallAverageAirQuality),
      status: overallStatus,
      rooms: roomsData,
    };
  } catch (error) {
    console.error("Error fetching air quality data:", error);

    // return fallback data in case of error
    return {
      averageCO2: 0,
      averageHumidity: 0,
      averageAirQuality: 0,
      status: "good",
      rooms: [],
    };
  }
}

// gets air quality data for a specific room
export async function getAirQualityByRoom(
  deviceId: string
): Promise<RoomAirQualityData | null> {
  try {
    const roomData = await prisma.sensorData.findMany({
      where: {
        deviceId: deviceId,
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        deviceId: true,
        temperature: true,
        humidity: true,
        co2: true,
        airQuality: true,
        timestamp: true,
      },
    });

    if (roomData.length === 0) {
      return null;
    }

    // calculate averages
    const avgCO2 =
      roomData.reduce((sum, record) => sum + record.co2, 0) / roomData.length;
    const avgHumidity =
      roomData.reduce((sum, record) => sum + record.humidity, 0) /
      roomData.length;
    const avgAirQuality =
      roomData.reduce((sum, record) => sum + record.airQuality, 0) /
      roomData.length;

    // Determine status
    const status = determineAirQualityStatus(avgCO2, avgAirQuality);

    // Get room name based on device ID position in overall dataset
    const allData = await prisma.sensorData.findMany({
      orderBy: { timestamp: "asc" },
      select: { deviceId: true },
    });

    const deviceIndex = allData.findIndex(
      (record) => record.deviceId === deviceId
    );
    const roomName = getRoomNameByIndex(deviceIndex);

    return {
      roomName,
      deviceId,
      averageCO2: roundToDecimal(avgCO2),
      averageHumidity: roundToDecimal(avgHumidity),
      averageAirQuality: roundToDecimal(avgAirQuality),
      status,
      lastUpdated: roomData[0].timestamp,
    };
  } catch (error) {
    console.error(
      `Error fetching air quality data for device ${deviceId}:`,
      error
    );
    return null;
  }
}
