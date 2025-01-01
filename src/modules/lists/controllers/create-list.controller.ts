import { createListService } from "../services/create-list.service";
import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { validateCreateListRequest } from "../requests/CreateListRequest";
import { authenticate } from "@/core/lib/auth";
import { Role } from "@/core/enums/role.enum";
import { apiSuccess } from "@/core/api-responses/api-success";

export async function CreateListController(request: Request) {
  try {
    const userId = await authenticate(request, Role.USER);
    const body = await request.json();
    const createListRequest = validateCreateListRequest(body);
    const response = await createListService(userId, createListRequest);
    return apiSuccess(response);
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
