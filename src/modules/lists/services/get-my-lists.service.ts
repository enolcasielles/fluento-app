import { prisma } from "@/core/lib/prisma";
import { GetMyListsResponse } from "../responses/GetMyListsResponse";

export async function getMyListsService(
  userId: string,
): Promise<GetMyListsResponse> {
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
      difficulty: list.difficulty,
      totalUnits: list.totalUnits,
      creationStatus: list.creationStatus,
    })),
  };
}
