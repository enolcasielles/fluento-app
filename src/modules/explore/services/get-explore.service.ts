import { prisma } from "@/core/lib/prisma";
import { GetExploreResponse } from "../responses/GetExploreResponse";

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
        difficulty: list.difficulty.toLowerCase() as
          | "beginner"
          | "intermediate"
          | "advanced",
        totalUnits: list.totalUnits,
      })),
    })),
  };
}
