import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { getUserService } from "../services/get-user.service";
import { Role } from "@/core/enums/role.enum";
import { authenticate } from "@/core/lib/auth";

export async function GetUserController(request: Request) {
  try {
    const userId = await authenticate(request, Role.USER);
    const response = await getUserService(userId);
    return Response.json(response);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message:
          "Se ha producido un error inesperado al obtener los datos del usuario",
      }),
    );
  }
}
