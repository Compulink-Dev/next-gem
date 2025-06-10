// types/paynow.d.ts
declare module 'paynow' {
  class Paynow {
    constructor(integrationId: string, integrationKey: string);
    createPayment(reference: string, email: string): Payment;
    send(payment: Payment): Promise<PaymentResponse>;
    pollTransaction(pollUrl: string): Promise<PaymentStatus>;
    resultUrl: string;
    returnUrl: string;
  }

  class Payment {
    add(title: string, amount: number): void;
  }

  interface PaymentResponse {
    success: boolean;
    redirectUrl?: string;
    pollUrl?: string;
    paymentId?: string;
    error?: string;
  }

  interface PaymentStatus {
    paid(): boolean;
    paymentId: string;
  }

  export default Paynow; // Changed from export = Paynow to export default
}