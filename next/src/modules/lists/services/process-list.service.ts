import { prisma } from "@/core/lib/prisma";
import { CustomError } from "@/core/errors";
import { CreationStatus } from "@/core/enums/creation-status.enum";
import { Difficulty } from "@/core/enums/difficulty.enum";
import { calculateResponseTime } from "@/core/engine/calculate-response-time";
import { List } from "@prisma/client";
import { generateListImage } from "@/core/engine/generate-list-image";
import { listGenerator } from "@/core/engine/list-generator";

export async function processListService(
  listId: string,
  userId: string,
): Promise<List> {
  try {
    const list = await prisma.list.findUnique({
      where: { id: listId, creatorId: userId },
      include: {
        units: true,
      },
    });

    if (!list) {
      throw new CustomError({
        message: "Lista no encontrada",
      });
    }

    if (list.units.length > 0) {
      throw new CustomError({
        message: "La lista ya tiene unidades",
      });
    }

    await prisma.list.update({
      where: { id: listId },
      data: {
        creationStatus: CreationStatus.IN_PROGRESS,
      },
    });

    if (!list.imageUrl) {
      try {
        const imageUrl = await generateListImage({
          topic: list.topic,
        });
        await prisma.list.update({
          where: { id: listId },
          data: {
            imageUrl,
          },
        });
      } catch (error) {}
    }

    try {
      const { units, description } = await listGenerator({
        difficulty: list.difficulty as Difficulty,
        topic: list.topic,
        grammarStructures: list.grammarStructures,
        numberOfUnits: 10,
      });

      //let index = 0;
      const unitsToCreate: Array<{
        questionText: string;
        questionAudio: string;
        answerText: string;
        answerAudio: string;
      }> = [];

      for (const unit of units) {
        //index++;
        // const questionAudioBuffer = await textToAudio({
        //   text: unit.questionText,
        // });
        // const answerAudioBuffer = await textToAudio({ text: unit.answerText });
        // const questionAudio = await uploadAudio({
        //   buffer: questionAudioBuffer,
        //   path: `lists/${listId}/question-${index}.mp3`,
        // });
        // const answerAudio = await uploadAudio({
        //   buffer: answerAudioBuffer,
        //   path: `lists/${listId}/answer-${index}.mp3`,
        // });

        unitsToCreate.push({
          questionText: unit.questionText,
          questionAudio: null,
          answerText: unit.answerText,
          answerAudio: null,
        });
      }

      await prisma.unit.createMany({
        data: unitsToCreate.map((unit) => ({
          ...unit,
          listId,
          responseTime: calculateResponseTime({
            answerText: unit.answerText,
            difficulty: list.difficulty as Difficulty,
          }),
        })),
      });

      const updatedList = await prisma.list.update({
        where: { id: listId },
        data: {
          creationStatus: CreationStatus.COMPLETED,
          description,
          totalUnits: unitsToCreate.length,
        },
      });

      return updatedList;
    } catch (error) {
      await prisma.list.update({
        where: { id: listId },
        data: {
          creationStatus: CreationStatus.FAILED,
        },
      });
      throw new CustomError({
        message:
          "Se ha producido un error al ejecutar los LLMs para generar las unidades",
      });
    }
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError({
      message: "Error al generar las unidades",
    });
  }
}
