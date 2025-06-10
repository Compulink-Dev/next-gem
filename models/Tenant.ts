// models/Tenant.ts
import { Schema, model } from 'mongoose';
import { z } from 'zod';

export const TenantSchema = z.object({
  name: z.string(),
  subdomain: z.string(),
  customDomain: z.string().optional(),
  plan: z.enum(['free', 'basic', 'pro', 'enterprise']),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ITenant = z.infer<typeof TenantSchema>;

const mongooseTenantSchema = new Schema<ITenant>({
  name: { type: String, required: true },
  subdomain: { type: String, required: true, unique: true },
  customDomain: { type: String, unique: true, sparse: true },
  plan: { type: String, enum: ['free', 'basic', 'pro', 'enterprise'], default: 'free' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Tenant = model<ITenant>('Tenant', mongooseTenantSchema);