import { CustomError } from "@/core/errors";
import { prisma } from "@/core/lib/prisma";
import { BasicResponse } from "@/core/responses/basic.response";
import { addMonths } from "date-fns";

export async function activateSubscriptionService(
  userId: string,
): Promise<BasicResponse> {
  try {
    // Get subscription from database
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
      },
    });

    if (subscription && !subscription.cancelAtPeriodEnd) {
      throw new CustomError({
        message: "El usuario ya tiene una suscripción activa",
        statusCode: 400,
      });
    } else if (subscription && subscription.cancelAtPeriodEnd) {
      await prisma.subscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          cancelAtPeriodEnd: false,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId,
          status: "active",
          currentPeriodEnd: addMonths(new Date(), 1),
          cancelAtPeriodEnd: false,
        },
      });
    }

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
