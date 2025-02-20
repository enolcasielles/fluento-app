import { stripe } from "@/core/lib/stripe";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "@/core/lib/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }

    const body = await request.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId);
        const userId = customer.metadata.userId;

        await prisma.subscription.upsert({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          create: {
            userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: customerId,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          update: {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: "canceled",
            cancelAtPeriodEnd: false,
          },
        });
        break;
      }
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      "Webhook error: " +
        (error instanceof Error ? error.message : "Unknown error"),
      {
        status: 400,
      },
    );
  }
}
