import { apiError } from "@/core/api-responses/api-error";
import { apiSuccess } from "@/core/api-responses/api-success";
import { CustomError } from "@/core/errors";
import { authenticate } from "@/core/lib/auth";
import { Role } from "@/core/enums/role.enum";
import { NextRequest } from "next/server";
import { activateSubscriptionService } from "../services/activate-subscription.service";

export async function ActivateSubscriptionController(request: NextRequest) {
  try {
    const userId = await authenticate(request, Role.USER);
    const result = await activateSubscriptionService(userId);
    return apiSuccess(result);
  } catch (error) {
    if (error instanceof CustomError) {
      return apiError(error);
    }
    return apiError(
      new CustomError({
        message: "Error al activar la suscripción",
      }),
    );
  }
}
