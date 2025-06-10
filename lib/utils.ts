import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts
export function getSubdomain(host?: string | null) {
  if (!host) return null;
  const parts = host.split('.');
  if (parts.length > 2) return parts[0];
  return null;
}

export function getPlanPrice(plan: string): number {
  const prices: Record<string, number> = {
    basic: 10,
    pro: 25,
    enterprise: 50,
  };
  return prices[plan] || 0;
}