import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent({
  amount,
  currency = "usd",
  description,
  metadata,
}: CreatePaymentIntentParams) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    description,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

export async function createCustomer(email: string, name: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  });

  return customer;
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.cancel(paymentIntentId);
}

export async function createSubscription(customerId: string, priceId: string) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
