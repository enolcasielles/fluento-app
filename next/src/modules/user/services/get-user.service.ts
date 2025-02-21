import { prisma } from "@/core/lib/prisma";
import { GetUserResponse } from "../responses/GetUserResponse";
import { CustomError } from "@/core/errors";

export async function getUserService(userId: string): Promise<GetUserResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    throw new CustomError({
      message: "Usuario no encontrado",
      statusCode: 404,
    });
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
