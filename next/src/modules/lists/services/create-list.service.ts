import { prisma } from "@/core/lib/prisma";
import { CreateListRequest } from "../requests/CreateListRequest";
import { CreateListResponse } from "../responses/CreateListResponse";
import { CustomError } from "@/core/errors";
import { Difficulty, DifficultyLabels } from "@/core/enums/difficulty.enum";
import { generateListUnitsService } from "./generate-list-units.service";
import {
  CreationStatus,
  CreationStatusLabels,
} from "@/core/enums/creation-status.enum";

export async function createListService(
  userId: string,
  request: CreateListRequest,
): Promise<CreateListResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isPremium: true },
  });

  if (!user.isPremium) {
    throw new CustomError({
      message: "Necesitas ser usuario Premium para crear listas",
      type: "NEED_PREMIUM",
      statusCode: 403,
    });
  }

  const list = await prisma.list.create({
    data: {
      name: request.name,
      difficulty: request.difficulty,
      topic: request.topic,
      grammarStructures: request.grammarStructures,
      creationStatus: CreationStatus.PENDING,
      isPublic: false,
      creatorId: user.id,
    },
  });

  //TODO: Migrar a un job
  const updatedList = await generateListUnitsService(list.id, userId);

  return {
    id: updatedList.id,
    name: updatedList.name,
    topic: updatedList.topic,
    grammarStructures: updatedList.grammarStructures,
    difficulty: updatedList.difficulty as Difficulty,
    difficultyLabel: DifficultyLabels[updatedList.difficulty],
    creationStatus: updatedList.creationStatus as CreationStatus,
    creationStatusLabel: CreationStatusLabels[updatedList.creationStatus],
  };
}
