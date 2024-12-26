import { createListService } from "../services/create-list.service";
import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import {
  CreateListRequest,
  validateCreateListRequest,
} from "../requests/CreateListRequest";
import { authenticate } from "@/core/lib/auth";
import { Role } from "@/core/enums/role.enum";

export async function CreateListController(request: Request) {
  try {
    const userId = await authenticate(request, Role.USER);
    const body = await request.json();
    validateCreateListRequest(body);
    const response = await createListService(userId, body as CreateListRequest);
    return Response.json(response);
  } catch (error) {
    console.error(error);
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
