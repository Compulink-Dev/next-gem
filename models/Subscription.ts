// models/Subscription.ts
import { Schema, model } from "mongoose";
import { z } from "zod";

export const SubscriptionSchema = z.object({
  tenantId: z.string(),
  plan: z.enum(["free", "basic", "pro", "enterprise"]),
  status: z.enum(["active", "past_due", "canceled", "unpaid"]),
  currentPeriodEnd: z.date(),
  paynowSubscriptionId: z.string().optional(),
  paymentMethod: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ISubscription = z.infer<typeof SubscriptionSchema>;

const mongooseSubscriptionSchema = new Schema<ISubscription>(
  {
    tenantId: { type: String, required: true, ref: "Tenant" },
    plan: {
      type: String,
      enum: ["free", "basic", "pro", "enterprise"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "past_due", "canceled", "unpaid"],
      required: true,
    },
    currentPeriodEnd: { type: Date, required: true },
    paynowSubscriptionId: { type: String },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

export const Subscription = model<ISubscription>(
  "Subscription",
  mongooseSubscriptionSchema
);
