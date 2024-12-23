import { NextApiRequest } from "next";
import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { getListDetailService } from "../services/get-list-detail.service";

export async function GetListDetailController(request: NextApiRequest) {
  try {
    const { listId } = request.query;
    const response = await getListDetailService({ listId: listId.toString() });
    return Response.json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message:
          "Se ha producido un error inesperado al obtener los detalles de la lista",
      }),
    );
  }
}
