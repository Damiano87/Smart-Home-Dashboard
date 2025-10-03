import { prisma } from "./prisma";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./schema";
import { compare } from "bcrypt";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // logic to verify if the user exists
          user = await prisma.user.findFirst({
            where: {
              email,
            },
          });

          if (!user) {
            throw new Error("Invalid credentials.");
          }

          // check if password is correct
          const passwordMatch = await compare(
            password,
            user.password as string
          );

          if (!passwordMatch) {
            throw new Error("Invalid password.");
          }

          // return user object with their profile data
          return user;
        } catch (error) {
          console.log("=== AUTHORIZE ERROR ===");
          console.log("Error type:", error?.constructor?.name);
          console.log(
            "Error message:",
            error instanceof Error ? error.message : error
          );
          console.log("Is ZodError:", error instanceof ZodError);

          if (error instanceof ZodError) {
            console.log("Zod validation errors:", error.errors);
            return null;
          }

          console.log("Returning null for other error");
          return null;
        }
      },
    }),
  ],
});
