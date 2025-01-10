import { prisma } from "@/core/lib/prisma";
import { GetMyListsResponse } from "../responses/GetMyListsResponse";
import { Difficulty, DifficultyLabels } from "@/core/enums/difficulty.enum";
import {
  CreationStatus,
  CreationStatusLabels,
} from "@/core/enums/creation-status.enum";

export async function getMyListsService(
  userId: string,
): Promise<GetMyListsResponse> {
  //TODO: Migrar a una respuesta paginada y añadir filtros
  const lists = await prisma.list.findMany({
    where: {
      creatorId: userId,
    },
  });

  return {
    lists: lists.map((list) => ({
      id: list.id,
      name: list.name,
      description: list.description || "",
      imageUrl: list.imageUrl || "",
      difficulty: list.difficulty as Difficulty,
      difficultyLabel: DifficultyLabels[list.difficulty],
      totalUnits: list.totalUnits,
      creationStatus: list.creationStatus as CreationStatus,
      creationStatusLabel: CreationStatusLabels[list.creationStatus],
    })),
  };
}
