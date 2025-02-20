import { CustomError } from "@/core/errors";
import { prisma } from "@/core/lib/prisma";
import { GetSubscriptionStatusResponse } from "../responses/GetSubscriptionStatusResponse";

export async function getSubscriptionStatusService(
  userId: string,
): Promise<GetSubscriptionStatusResponse> {
  try {
    // Get subscription from database
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
      },
    });

    if (!subscription) {
      return {
        isActive: false,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }

    return {
      isActive: true,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
    };
  } catch (error) {
    console.error("Error getting subscription status:", error);
    throw new CustomError({
      message: "Error al obtener el estado de la suscripción",
      type: "StripeError",
      statusCode: 500,
    });
  }
}
