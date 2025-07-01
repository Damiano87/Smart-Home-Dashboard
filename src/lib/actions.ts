"use server";

import { schema } from "@/lib/schema";
import { prisma } from "./prisma";
import { executeAction } from "./executeAction";
import bcrypt from "bcrypt";
import { signIn } from "./auth";
import { redirect } from "next/navigation";

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

// get temperature data from last 24 hours
const getLast24hTemperatureData = async () => {
  const data = await prisma.sensorData.findMany({
    where: {
      // timestamp: {
      //   gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24h
      // },
      device: {
        type: "temperature_sensor",
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
      timestamp: "asc",
    },
  });

  return data;
};

export { signUp, signInWithCredentials, getLast24hTemperatureData };
