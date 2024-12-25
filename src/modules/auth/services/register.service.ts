import { CustomError } from "@/core/errors/custom-error";
import { supabase } from "@/core/lib/supabase";
import { prisma } from "@/core/lib/prisma";
import { Role } from "@/core/enums/role.enum";
import {
  BasicResponse,
  successResponse,
} from "@/core/responses/basic.response";

export const registerService = async (
  email: string,
  name: string,
  password: string,
): Promise<BasicResponse> => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (user) {
    throw new CustomError({
      message: "El usuario ya existe",
      statusCode: 400,
    });
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw new CustomError({
      message: "Error al crear el usuario",
      statusCode: 400,
    });
  }
  await prisma.user.create({
    data: {
      email: email,
      name: name,
      role: Role.USER,
      sub: data.user.id,
      isPremium: false,
    },
  });
  return successResponse();
};
