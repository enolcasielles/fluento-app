import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { getMyListsService } from "../services/get-my-lists.service";
import { Role } from "@/core/enums/role.enum";
import { authenticate } from "@/core/lib/auth";
import { apiSuccess } from "@/core/api-responses/api-success";

export async function GetMyListsController(request: Request) {
  try {
    const userId = await authenticate(request, Role.USER);
    const response = await getMyListsService(userId);
    return apiSuccess(response);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Se ha producido un error inesperado al obtener tus listas",
      }),
    );
  }
}
