import { prisma } from "@/core/lib/prisma";
import { GetExploreResponse } from "../responses/GetExploreResponse";
import { Difficulty } from "@/core/enums/difficulty.enum";

export async function getExploreService(): Promise<GetExploreResponse> {
  const categories = await prisma.category.findMany({
    include: {
      lists: {
        where: {
          isPublic: true,
          creationStatus: "COMPLETED",
        },
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          difficulty: true,
          totalUnits: true,
        },
      },
    },
  });

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      lists: category.lists.map((list) => ({
        id: list.id,
        name: list.name,
        description: list.description || "",
        imageUrl: list.imageUrl || "",
        difficulty: list.difficulty as Difficulty,
        totalUnits: list.totalUnits,
      })),
    })),
  };
}
