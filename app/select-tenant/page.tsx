// app/select-tenant/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Tenant = {
  _id: string;
  name: string;
  subdomain: string;
};

export default function SelectTenantPage() {
  const router = useRouter();

  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    async function fetchTenants() {
      const response = await fetch("/api/auth/tenants");
      if (response.ok) {
        const data = await response.json();
        setTenants(data.tenants);
      }
    }
    fetchTenants();
  }, []);

  async function selectTenant(tenantId: string) {
    const response = await fetch("/api/auth/select-tenant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
    });

    if (response.ok) {
      const { redirectUrl } = await response.json();
      router.push(redirectUrl);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Select Tenant</h1>
      <div className="space-y-2">
        {tenants.map((tenant) => (
          <Button
            key={tenant._id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => selectTenant(tenant._id)}
          >
            {tenant.name} ({tenant.subdomain})
          </Button>
        ))}
      </div>
    </div>
  );
}
