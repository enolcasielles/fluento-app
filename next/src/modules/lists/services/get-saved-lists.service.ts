import { prisma } from "@/core/lib/prisma";
import { GetSavedListsResponse } from "../responses/GetSavedListsResponse";
import { Difficulty, DifficultyLabels } from "@/core/enums/difficulty.enum";

export async function getSavedListsService(
  userId: string,
): Promise<GetSavedListsResponse> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      savedLists: true,
    },
  });

  return {
    lists: user.savedLists.map((list) => {
      return {
        id: list.id,
        name: list.name,
        description: list.description || "",
        imageUrl: list.imageUrl || "",
        difficulty: list.difficulty as Difficulty,
        difficultyLabel: DifficultyLabels[list.difficulty],
        totalUnits: list.totalUnits,
      };
    }),
  };
}
