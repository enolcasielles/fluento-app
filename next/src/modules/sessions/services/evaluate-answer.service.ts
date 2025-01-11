import { prisma } from "@/core/lib/prisma";
import { EvaluateAnswerResponse } from "../responses/EvaluateAnswerResponse";
import { CustomError } from "@/core/errors";
import { audioToText } from "@/core/engine/audio-to-text";
import { evaluateAnswer } from "@/core/engine/evaluate-answer";

export async function evaluateAnswerService(
  sessionId: string,
  unitId: string,
  userId: string,
  audioFile: File,
): Promise<EvaluateAnswerResponse> {
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

  const transcription = await audioToText(audioFile);

  console.log(transcription);

  const score = await evaluateAnswer(unit.answerText, transcription);

  return { score, answer: transcription };
}
