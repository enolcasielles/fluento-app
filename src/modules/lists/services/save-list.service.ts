import { CustomError } from "@/core/errors";
import { prisma } from "@/core/lib/prisma";

interface Props {
  listId: string;
  userId: string;
}

export async function saveListService({ listId, userId }: Props) {
  const list = await prisma.list.findUnique({
    where: {
      id: listId,
    },
  });

  if (!list) {
    throw new CustomError({
      message: "La lista que intentas guardar no existe",
    });
  }

  if (!list.isPublic && list.creatorId !== userId) {
    throw new CustomError({
      message: "No tienes permisos para guardar esta lista",
    });
  }

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

  const listAlreadySaved = user.savedLists.length > 0;

  if (listAlreadySaved) {
    throw new CustomError({
      message: "Ya tienes guardada esta lista",
    });
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      savedLists: {
        connect: {
          id: listId,
        },
      },
    },
  });
}
