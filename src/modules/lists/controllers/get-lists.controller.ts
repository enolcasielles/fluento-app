import { getListsService } from "../services/get-lists.service";
import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";

export async function GetListsController() {
  try {
    const response = await getListsService();
    return Response.json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Se ha producido un error inesperado al obtener las listas",
      }),
    );
  }
}
