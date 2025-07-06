"use server";

import { schema } from "@/lib/schema";
import { prisma } from "./prisma";
import { executeAction } from "./executeAction";
import bcrypt from "bcrypt";
import { signIn } from "./auth";
import { redirect } from "next/navigation";
import { RoomType } from "@/types/types";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = schema.parse({ email, password });
      await prisma.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          password: await bcrypt.hash(validatedData.password, 10),
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

const signInWithCredentials = async (_: any, formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log(res);

    if (!res?.ok) {
      return {
        success: false,
        error:
          res?.error === "CredentialsSignin"
            ? "Nieprawidłowy email lub hasło."
            : "Wystąpił nieoczekiwany błąd.",
      };
    }

    redirect("/");
  } catch (error) {
    console.error(error);
  }
};

const getTemperatureDataByRoom = async (roomType: RoomType) => {
  try {
    const baseQuery = {
      where: {
        device: {
          type: "temperature_sensor",
          ...(roomType !== "all" && {
            room: {
              name: {
                equals: roomType,
                mode: "insensitive" as const,
              },
            },
          }),
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
        timestamp: "asc" as const,
      },
    };

    const data = await prisma.sensorData.findMany(baseQuery);
    return data;
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    return { success: false, error: "Nie udało się pobrać danych temperatury" };
  }
};

// get last 24 hours
const getLast24hTemperatureDataByRoom = async (roomType: RoomType) => {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const baseQuery = {
      where: {
        timestamp: {
          gte: twentyFourHoursAgo,
        },
        device: {
          type: "temperature_sensor",
          ...(roomType !== "all" && {
            room: {
              name: {
                equals: roomType,
                mode: "insensitive" as const,
              },
            },
          }),
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
        timestamp: "asc" as const,
      },
    };

    const data = await prisma.sensorData.findMany(baseQuery);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching last 24h temperature data:", error);
    return {
      success: false,
      error: "Nie udało się pobrać danych temperatury z ostatnich 24h",
    };
  }
};

export {
  signUp,
  signInWithCredentials,
  getTemperatureDataByRoom,
  getLast24hTemperatureDataByRoom,
};

// timestamp: {
//   gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24h
// },
