// app/[tenant]/billing/page.tsx
'use client';

import { useStore } from '@/stores/tenant-store';
import { Button } from '@/components/ui/button';
import { createPayment } from '@/lib/paynow';

export default function BillingPage() {
  const { tenant } = useStore();
  
  const handleUpgrade = async (plan: 'basic' | 'pro' | 'enterprise') => {
    const amount = getPlanPrice(plan);
    const response = await createPayment(
      tenant._id,
      amount,
      `Upgrade to ${plan} plan`,
      tenant.email
    );
    window.location.href = response.redirectUrl;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlanCard 
          name="Basic" 
          price={10} 
          features={[...]}
          onSelect={() => handleUpgrade('basic')}
        />
        <PlanCard 
          name="Pro" 
          price={25} 
          features={[...]}
          onSelect={() => handleUpgrade('pro')}
        />
        <PlanCard 
          name="Enterprise" 
          price={50} 
          features={[...]}
          onSelect={() => handleUpgrade('enterprise')}
        />
      </div>
    </div>
  );
}