import { prisma } from "@/core/lib/prisma";
import { GetListDetailResponse } from "../responses/GetListDetailResponse";
import { CustomError } from "@/core/errors";
import { CreationStatus } from "@/core/enums/creation-status.enum";
import { Difficulty } from "@/core/enums/difficulty.enum";

export async function getListDetailService(
  listId: string,
  userId: string,
): Promise<GetListDetailResponse> {
  const list = await prisma.list.findUnique({
    where: {
      id: listId,
    },
    include: {
      creator: true,
    },
  });

  if (!list) {
    throw new CustomError({
      message: "La lista no existe",
      statusCode: 404,
    });
  }

  if (!list.isPublic && list.creatorId !== userId) {
    throw new CustomError({
      message: "No tienes permiso para ver esta lista",
      statusCode: 403,
    });
  }

  if (!list.isPublic && !list.creator?.isPremium) {
    throw new CustomError({
      message: "Necesitas una cuenta premium para ver esta lista",
      type: "NEED_PREMIUM",
      statusCode: 403,
    });
  }

  const session = await prisma.session.findFirst({
    where: {
      listId,
      userId,
    },
    include: {
      results: {
        include: {
          unit: true,
        },
      },
    },
  });

  const savedList = await prisma.list.findFirst({
    where: {
      id: listId,
      savedBy: {
        some: {
          id: userId,
        },
      },
    },
  });

  const bestResults = session?.results.reduce(
    (acc, result) => {
      if (!acc[result.unit.id] || acc[result.unit.id].score < result.score) {
        acc[result.unit.id] = result;
      }
      return acc;
    },
    {} as Record<string, (typeof session.results)[0]>,
  );

  const uniqueBestResults = bestResults ? Object.values(bestResults) : [];

  const userProgress = {
    practicedUnits: uniqueBestResults.length,
    passedUnits: uniqueBestResults.filter((result) => result.score >= 3).length,
    averageScore:
      uniqueBestResults.reduce((acc, result) => acc + result.score, 0) /
      uniqueBestResults.length,
  };

  if (!list) {
    throw new CustomError({
      message: "La lista no existe",
      statusCode: 404,
    });
  }

  if (!list.isPublic && list.creatorId !== userId) {
    throw new CustomError({
      message: "No tienes permiso para ver esta lista",
      statusCode: 403,
    });
  }

  return {
    id: list.id,
    name: list.name,
    description: list.description || "",
    imageUrl: list.imageUrl || "",
    difficulty: list.difficulty as Difficulty,
    topic: list.topic,
    grammarStructures: list.grammarStructures,
    totalUnits: list.totalUnits,
    isSaved: savedList ? true : false,
    creationStatus: list.creationStatus as CreationStatus,
    userProgress,
  };
}
