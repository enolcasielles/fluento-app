import { apiError } from "@/core/api-responses/api-error";
import { apiSuccess } from "@/core/api-responses/api-success";
import { CustomError } from "@/core/errors";
import { getSubscriptionStatusService } from "../services/get-subscription-status.service";
import { authenticate } from "@/core/lib/auth";
import { Role } from "@/core/enums/role.enum";

export async function GetSubscriptionStatusController(request: Request) {
  try {
    const userId = await authenticate(request, Role.USER);
    const result = await getSubscriptionStatusService(userId);
    return apiSuccess(result);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Error al obtener el estado de la suscripción",
      }),
    );
  }
}
