// lib/paynow.ts
import Paynow from 'paynow';

interface PaymentResponse {
  success: boolean;
  redirectUrl?: string;
  pollUrl?: string;
  paymentId?: string;
  error?: string;
}

export const paynow = new Paynow(
  process.env.PAYNOW_INTEGRATION_ID!,
  process.env.PAYNOW_INTEGRATION_KEY!
);

// Set URLs based on environment
paynow.resultUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`;
paynow.returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payments/success`;

export async function createPayment(
  tenantId: string,
  amount: number,
  description: string,
  email: string
): Promise<{
  redirectUrl: string;
  pollUrl: string;
  paymentId: string;
}> {
  const payment = paynow.createPayment(`Subscription-${tenantId}`, email);
  payment.add(description, amount);
  
  const response = await paynow.send(payment) as PaymentResponse;
  
  if (response.success && response.redirectUrl && response.pollUrl && response.paymentId) {
    return {
      redirectUrl: response.redirectUrl,
      pollUrl: response.pollUrl,
      paymentId: response.paymentId,
    };
  }
  
  throw new Error(response.error || 'Failed to create payment');
}

export async function checkPaymentStatus(pollUrl: string): Promise<{ paid: boolean }> {
  const status = await paynow.pollTransaction(pollUrl);
  return { paid: status.paid() };
}