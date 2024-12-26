import { prisma } from "@/core/lib/prisma";
import { CreateListRequest } from "../requests/CreateListRequest";
import { CreateListResponse } from "../responses/CreateListResponse";
import { CustomError } from "@/core/errors";
import { CreationStatus } from "@/core/enums/creation-status.enum";
import { Difficulty } from "@/core/enums/difficulty.enum";

export async function createListService(
  userId: string,
  request: CreateListRequest,
): Promise<CreateListResponse> {
  console.log("userId", userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isPremium: true },
  });

  if (!user.isPremium) {
    throw new CustomError({
      message: "Necesitas ser usuario Premium para crear listas",
      statusCode: 403,
    });
  }

  const list = await prisma.list.create({
    data: {
      name: request.name,
      difficulty: request.difficulty,
      topic: request.topic,
      grammarStructures: request.grammarStructures,
      creationStatus: CreationStatus.IN_PROGRESS,
      isPublic: false,
      creatorId: user.id,
    },
  });

  //TODO: Crear un job para crear las unidades de la lista

  return {
    id: list.id,
    name: list.name,
    topic: list.topic,
    grammarStructures: list.grammarStructures,
    difficulty: list.difficulty as Difficulty,
    creationStatus: list.creationStatus as CreationStatus,
  };
}
