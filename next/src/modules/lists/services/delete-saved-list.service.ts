import { prisma } from "@/core/lib/prisma";
import { CustomError } from "@/core/errors";

export async function deleteSavedListService(
  listId: string,
  userId: string,
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      savedLists: {
        where: {
          id: listId,
        },
      },
    },
  });

  if (!user.savedLists.length) {
    throw new CustomError({
      message: "La lista no está guardada",
      statusCode: 404,
    });
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      savedLists: {
        disconnect: {
          id: listId,
        },
      },
    },
  });
}
