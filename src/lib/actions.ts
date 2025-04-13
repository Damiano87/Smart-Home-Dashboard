import { schema } from "@/lib/schema";
import { prisma } from "./prisma";
import { executeAction } from "./executeAction";
import bcrypt from "bcrypt";

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

export { signUp };
