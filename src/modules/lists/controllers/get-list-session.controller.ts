import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { getListSessionService } from "../services/get-list-session.service";
import { Role } from "@/core/enums/role.enum";
import { authenticate } from "@/core/lib/auth";

export async function GetListSessionController(
  request: Request,
  { params }: { params: { listId: string } },
) {
  try {
    const userId = await authenticate(request, Role.USER);
    const response = await getListSessionService(params.listId, userId);
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
