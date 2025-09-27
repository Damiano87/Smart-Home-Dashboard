import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { signInSchema } from "./schema";
import Google from "next-auth/providers/google";
import { compare } from "bcrypt";
import { ZodError } from "zod";

const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    // GitHub,
    // Google,
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
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, account }) {
  //     if (account?.provider === "credentials") {
  //       token.credentials = true;
  //     }
  //     return token;
  //   },
  // },
  // jwt: {
  //   encode: async function (params) {
  //     if (params.token?.credentials) {
  //       const sessionToken = uuid();

  //       if (!params.token.sub) {
  //         throw new Error("No user ID found in token");
  //       }

  //       const createdSession = await adapter?.createSession?.({
  //         sessionToken: sessionToken,
  //         userId: params.token.sub,
  //         expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  //       });

  //       if (!createdSession) {
  //         throw new Error("Failed to create session");
  //       }

  //       return sessionToken;
  //     }
  //     return defaultEncode(params);
  //   },
  // },
});
