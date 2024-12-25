import { prisma } from "@/core/lib/prisma";
import { GetSavedListsResponse } from "../responses/GetSavedListsResponse";

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
        difficulty: list.difficulty,
        totalUnits: list.totalUnits,
        creationStatus: list.creationStatus,
      };
    }),
  };
}
