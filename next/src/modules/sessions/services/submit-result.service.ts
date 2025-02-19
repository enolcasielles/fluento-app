import { prisma } from "@/core/lib/prisma";
import { SubmitResultRequest } from "../requests/SubmitResultRequest";
import { SubmitResultResponse } from "../responses/SubmitResultResponse";
import { CustomError } from "@/core/errors";
import { generateNextUnit } from "@/core/engine/generate-next-unit";
import { NO_ANSWER } from "@/core/constants/constants";

export async function submitResultService(
  sessionId: string,
  unitId: string,
  userId: string,
  request: SubmitResultRequest,
): Promise<SubmitResultResponse> {
  // Verificar que la sesión existe y pertenece al usuario
  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
      userId: userId,
    },
    include: {
      list: {
        include: {
          units: {
            where: {
              id: unitId,
            },
          },
        },
      },
    },
  });

  if (!session) {
    throw new CustomError({
      message: "Sesión no encontrada",
      statusCode: 404,
    });
  }

  const unit = session.list.units.find((unit) => unit.id === unitId);

  if (!unit) {
    throw new CustomError({
      message: "La unidad no pertenece a la lista de la sesión",
      statusCode: 404,
    });
  }

  // Registrar el resultado
  await prisma.result.create({
    data: {
      score: request.score,
      answer: request.answer ?? NO_ANSWER,
      session: {
        connect: { id: sessionId },
      },
      unit: {
        connect: { id: unitId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });

  // Obtener siguiente unidad
  const nextUnit = await generateNextUnit(sessionId);

  return {
    nextUnit: {
      id: nextUnit.id,
      question: {
        text: nextUnit.questionText,
        audio: nextUnit.questionAudio,
      },
      answer: {
        text: nextUnit.answerText,
        audio: nextUnit.answerAudio,
      },
      responseTime: nextUnit.responseTime,
    },
  };
}
