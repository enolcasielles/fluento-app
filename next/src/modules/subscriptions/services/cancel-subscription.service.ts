import { CustomError } from "@/core/errors";
import { prisma } from "@/core/lib/prisma";
import { BasicResponse } from "@/core/responses/basic.response";

export async function cancelSubscriptionService(
  userId: string,
): Promise<BasicResponse> {
  try {
    if (!userId) {
      throw new CustomError({
        message: "Usuario no autenticado",
        type: "AuthenticationError",
        statusCode: 401,
      });
    }

    // Get subscription from database
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
      },
    });

    if (!subscription) {
      throw new CustomError({
        message: "No se encontró una suscripción activa",
        type: "NotFoundError",
        statusCode: 404,
      });
    }

    // Update subscription in database
    await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw new CustomError({
      message: "Error al cancelar la suscripción",
      type: "StripeError",
      statusCode: 500,
    });
  }
}
