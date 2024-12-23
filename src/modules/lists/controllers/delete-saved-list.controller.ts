import { NextApiRequest } from "next";
import { deleteSavedListService } from "../services/delete-saved-list.service";
import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { NextResponse } from "next/server";
import { successResponse } from "@/core/responses/basic.response";

export async function DeleteSavedListController(request: NextApiRequest) {
  try {
    const { listId } = request.query;
    await deleteSavedListService({ listId: listId.toString() });
    return NextResponse.json(successResponse());
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message:
          "Se ha producido un error inesperado intentando eliminar la lista guardada",
      }),
    );
  }
}
