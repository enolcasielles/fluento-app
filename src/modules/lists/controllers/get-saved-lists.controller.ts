import { getSavedListsService } from "../services/get-saved-lists.service";
import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";

export async function GetSavedListsController() {
  try {
    const response = await getSavedListsService();
    return Response.json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message:
          "Se ha producido un error inesperado al obtener las listas guardadas",
      }),
    );
  }
}
