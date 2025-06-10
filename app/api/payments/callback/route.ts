// app/api/payments/callback/route.ts
import { NextResponse } from 'next/server';
import { checkPaymentStatus } from '@/lib/paynow';
import { Subscription } from '@/models/Subscription';

export async function POST(request: Request) {
  const data = await request.json();
  
  if (!data.pollUrl) {
    return NextResponse.json({ error: 'Missing pollUrl' }, { status: 400 });
  }

  const status = await checkPaymentStatus(data.pollUrl);
  
  if (status.paid()) {
    // Update subscription in database
    const subscription = await Subscription.findOneAndUpdate(
      { paynowSubscriptionId: status.paymentId },
      { status: 'active', currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { new: true }
    );
    
    if (subscription) {
      return NextResponse.json({ success: true });
    }
  }
  
  return NextResponse.json({ success: false });
}