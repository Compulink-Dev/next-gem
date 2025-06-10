"use client";
// components/admin/CreateTenantButton.tsx

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CreateTenantButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.push("/admin/tenants/create")}>
      Create Tenant
    </Button>
  );
}
