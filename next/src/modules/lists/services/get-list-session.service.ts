import { prisma } from "@/core/lib/prisma";
import { GetListSessionResponse } from "../responses/GetListSessionResponse";
import { CustomError } from "@/core/errors";
import { generateNextUnit } from "@/core/engine/generate-next-unit";

export async function getListSessionService(
  listId: string,
  userId: string,
): Promise<GetListSessionResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: true,
    },
  });

  if (!user) {
    throw new CustomError({
      message: "El usuario no existe",
      statusCode: 404,
    });
  }

  const list = await prisma.list.findUnique({
    where: { id: listId },
  });

  if (!list) {
    throw new CustomError({
      message: "La lista no existe",
      statusCode: 404,
    });
  }

  const isPremium = user.subscriptions.some(
    (subscription) => subscription.status === "active",
  );

  if (!list.isPublic && list.creatorId !== userId) {
    throw new CustomError({
      message: "No tienes permiso para acceder a esta lista",
      statusCode: 403,
    });
  }

  // Buscar una sesión existente o crear una nueva
  let session = await prisma.session.findFirst({
    where: {
      listId,
      userId,
    },
  });

  if (!session) {
    session = await prisma.session.create({
      data: {
        listId,
        userId,
      },
    });
  }

  const nextUnit = await generateNextUnit(session.id);

  return {
    sessionId: session.id,
    listId: list.id,
    listName: list.name,
    evaluationMode: isPremium ? "auto" : "manual",
    nextUnit: {
      id: nextUnit.id,
      answer: {
        text: nextUnit.answerText,
        audio: nextUnit.answerAudio,
      },
      question: {
        text: nextUnit.questionText,
        audio: nextUnit.questionAudio,
      },
      responseTime: nextUnit.responseTime,
    },
  };
}
