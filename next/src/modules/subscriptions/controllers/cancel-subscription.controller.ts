import { apiError } from "@/core/api-responses/api-error";
import { apiSuccess } from "@/core/api-responses/api-success";
import { CustomError } from "@/core/errors";
import { cancelSubscriptionService } from "../services/cancel-subscription.service";
import { authenticate } from "@/core/lib/auth";
import { Role } from "@/core/enums/role.enum";

export async function CancelSubscriptionController(request: Request) {
  try {
    const userId = await authenticate(request, Role.USER);
    const result = await cancelSubscriptionService(userId);
    return apiSuccess(result);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Error al cancelar la suscripción",
      }),
    );
  }
}
