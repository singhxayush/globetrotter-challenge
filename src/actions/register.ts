"use server";

import {registerSchema} from "@/app/schemas";
import {db} from "@/lib/db";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(values);
  if (!validatedFields.success) {
    return {error: "Invalid Fields!"};
  }

  const {name, email, password} = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {error: "Email already in use!"};
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {success: "User has been registered"};
};
