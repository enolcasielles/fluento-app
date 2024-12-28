import { CustomError } from "@/core/errors";
import { apiError } from "@/core/api-responses/api-error";
import { generateListUnitsService } from "../services/generate-list-units.service";
import { Role } from "@/core/enums/role.enum";
import { authenticate } from "@/core/lib/auth";
import { apiSuccess } from "@/core/api-responses/api-success";

export async function GenerateListUnitsController(
  request: Request,
  { params }: { params: { listId: string } },
) {
  try {
    const userId = await authenticate(request, Role.USER);
    await generateListUnitsService(params.listId, userId);
    return apiSuccess();
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Se ha producido un error inesperado al generar las unidades",
      }),
    );
  }
}
