import { NextApiRequest } from "next";
import { createListService } from "../services/create-list.service";
import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { CreateListRequest } from "../requests/CreateListRequest";

export async function CreateListController(request: NextApiRequest) {
  try {
    const body = request.body;
    // TODO: Validate request body
    const response = await createListService(body as CreateListRequest);
    return Response.json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Se ha producido un error inesperado al crear la lista",
      }),
    );
  }
}
