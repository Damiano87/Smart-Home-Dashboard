"use server";

import { prisma } from "@/lib/prisma";

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({});

    return { data: users, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Cannot fetch users" };
  }
};
