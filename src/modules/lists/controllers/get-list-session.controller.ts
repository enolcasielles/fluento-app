import { NextApiRequest } from "next";
import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { getListSessionService } from "../services/get-list-session.service";

export async function GetListSessionController(request: NextApiRequest) {
  try {
    const { listId } = request.query;
    const response = await getListSessionService({ listId: listId.toString() });
    return Response.json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message:
          "Se ha producido un error inesperado al obtener la sesión de la lista",
      }),
    );
  }
}
