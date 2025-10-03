"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RoomWithLights } from "./types";

/**
 * Toggle all lights in a specific room
 */
export async function toggleRoomLights(roomId: string, isOn: boolean) {
  try {
    // Get all light devices in the room
    const lightDevices = await prisma.device.findMany({
      where: {
        roomId,
        type: "light",
        isActive: true,
      },
      include: {
        light: true,
      },
    });

    // Update all lights in the room
    const updatePromises = lightDevices.map((device) =>
      prisma.light.update({
        where: { deviceId: device.id },
        data: {
          isOn,
          updatedAt: new Date(),
        },
      })
    );

    await Promise.all(updatePromises);

    // Create events for each device
    const eventPromises = lightDevices.map((device) =>
      prisma.deviceEvent.create({
        data: {
          deviceId: device.id,
          type: isOn ? "turned_on" : "turned_off",
          details: {
            triggeredBy: "room_control",
            brightness: device.light?.brightness || 100,
          },
        },
      })
    );

    await Promise.all(eventPromises);

    revalidatePath("/dashboard");
    return {
      success: true,
      message: `Room lights ${isOn ? "turned on" : "turned off"}`,
    };
  } catch (error) {
    console.error("Error toggling room lights:", error);
    return { success: false, message: "Failed to toggle room lights" };
  }
}

/**
 * Set brightness for all lights in a room
 */
export async function setRoomBrightness(roomId: string, brightness: number) {
  try {
    const lightDevices = await prisma.device.findMany({
      where: {
        roomId,
        type: "light",
        isActive: true,
      },
    });

    const updatePromises = lightDevices.map((device) =>
      prisma.light.update({
        where: { deviceId: device.id },
        data: {
          brightness,
          isOn: brightness > 0,
          updatedAt: new Date(),
        },
      })
    );

    await Promise.all(updatePromises);

    revalidatePath("/dashboard");
    return { success: true, message: `Room brightness set to ${brightness}%` };
  } catch (error) {
    console.error("Error setting room brightness:", error);
    return { success: false, message: "Failed to set room brightness" };
  }
}

/**
 * Toggle individual light
 */
export async function toggleIndividualLight(deviceId: string, isOn: boolean) {
  try {
    await prisma.light.update({
      where: { deviceId },
      data: {
        isOn,
        updatedAt: new Date(),
      },
    });

    await prisma.deviceEvent.create({
      data: {
        deviceId,
        type: isOn ? "turned_on" : "turned_off",
        details: {
          triggeredBy: "individual_control",
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error toggling individual light:", error);
    return { success: false, message: "Failed to toggle light" };
  }
}

/**
 * Set brightness for individual light
 */
export async function setIndividualLightBrightness(
  deviceId: string,
  brightness: number
) {
  try {
    await prisma.light.update({
      where: { deviceId },
      data: {
        brightness,
        isOn: brightness > 0,
        updatedAt: new Date(),
      },
    });

    await prisma.deviceEvent.create({
      data: {
        deviceId,
        type: "brightness_changed",
        details: {
          brightness,
          triggeredBy: "individual_control",
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error setting individual light brightness:", error);
    return { success: false, message: "Failed to set light brightness" };
  }
}

/**
 * Set color for individual light
 */
export async function setLightColor(deviceId: string, color: string) {
  try {
    await prisma.light.update({
      where: { deviceId },
      data: {
        color,
        updatedAt: new Date(),
      },
    });

    await prisma.deviceEvent.create({
      data: {
        deviceId,
        type: "color_changed",
        details: {
          color,
          triggeredBy: "user_control",
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error setting light color:", error);
    return { success: false, message: "Failed to set light color" };
  }
}

/**
 * Set timer for light (turn on/off at specific time)
 */
export async function setLightTimer(
  deviceId: string,
  timerType: "on" | "off",
  time: Date | null
) {
  try {
    const updateData =
      timerType === "on"
        ? { timerOn: time, updatedAt: new Date() }
        : { timerOff: time, updatedAt: new Date() };

    await prisma.light.update({
      where: { deviceId },
      data: updateData,
    });

    await prisma.deviceEvent.create({
      data: {
        deviceId,
        type: `timer_${timerType}_set`,
        details: {
          timerType,
          time: time?.toISOString(),
          triggeredBy: "user_control",
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error setting light timer:", error);
    return { success: false, message: "Failed to set light timer" };
  }
}

/**
 * Toggle all lights in the entire home
 */
export async function toggleAllHomeLights(homeId: string, isOn: boolean) {
  try {
    // Get all rooms in the home
    const rooms = await prisma.room.findMany({
      where: { homeId },
      include: {
        devices: {
          where: {
            type: "light",
            isActive: true,
            status: "online",
          },
        },
      },
    });

    // Update all lights in all rooms
    const allDeviceIds = rooms.flatMap((room) =>
      room.devices.map((device) => device.id)
    );

    if (allDeviceIds.length > 0) {
      await prisma.light.updateMany({
        where: {
          deviceId: { in: allDeviceIds },
        },
        data: {
          isOn,
          updatedAt: new Date(),
        },
      });

      // Create events for all devices
      const eventPromises = allDeviceIds.map((deviceId) =>
        prisma.deviceEvent.create({
          data: {
            deviceId,
            type: isOn ? "turned_on" : "turned_off",
            details: {
              triggeredBy: "home_control",
              scope: "all_lights",
            },
          },
        })
      );

      await Promise.all(eventPromises);
    }

    revalidatePath("/dashboard");
    return {
      success: true,
      message: `All home lights ${isOn ? "turned on" : "turned off"}`,
      affectedLights: allDeviceIds.length,
    };
  } catch (error) {
    console.error("Error toggling all home lights:", error);
    return { success: false, message: "Failed to toggle all home lights" };
  }
}

/**
 * Fetch rooms with their light devices
 */
export async function getRoomsWithLights(): Promise<RoomWithLights[]> {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        devices: {
          where: {
            type: "light",
            isActive: true,
          },
          include: {
            light: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return rooms;
  } catch (error) {
    console.error("Error fetching rooms with lights:", error);
    return [];
  }
}

/**
 * Get light statistics for dashboard
 */
export async function getLightStatistics() {
  try {
    const [totalLights, onlineLights, activeLights, offlineLights] =
      await Promise.all([
        prisma.device.count({
          where: {
            type: "light",
            isActive: true,
          },
        }),
        prisma.device.count({
          where: {
            type: "light",
            isActive: true,
            status: "online",
          },
        }),
        prisma.device.count({
          where: {
            type: "light",
            isActive: true,
            status: "online",
            light: {
              isOn: true,
            },
          },
        }),
        prisma.device.count({
          where: {
            type: "light",
            isActive: true,
            status: "offline",
          },
        }),
      ]);

    return {
      total: totalLights,
      online: onlineLights,
      active: activeLights,
      offline: offlineLights,
      onlinePercentage:
        totalLights > 0 ? Math.round((onlineLights / totalLights) * 100) : 0,
      activePercentage:
        onlineLights > 0 ? Math.round((activeLights / onlineLights) * 100) : 0,
    };
  } catch (error) {
    console.error("Error fetching light statistics:", error);
    return {
      total: 0,
      online: 0,
      active: 0,
      offline: 0,
      onlinePercentage: 0,
      activePercentage: 0,
    };
  }
}

/**
 * Get recent light events for activity feed
 */
export async function getRecentLightEvents(limit: number = 10) {
  try {
    const events = await prisma.deviceEvent.findMany({
      where: {
        device: {
          type: "light",
        },
      },
      include: {
        device: {
          include: {
            room: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });

    return events;
  } catch (error) {
    console.error("Error fetching recent light events:", error);
    return [];
  }
}
