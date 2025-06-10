// providers/TenantProvider.tsx
"use client";

import { createContext, useContext, useEffect } from "react";
import { useStore } from "@/stores/tenant-store";
import { api } from "@/lib/api";

interface Tenant {
  name: string;
  subdomain: string;
  plan: "free" | "basic" | "pro" | "enterprise";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  customDomain?: string;
  _id?: string; // Optional, in case it's present
}

interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
}

export const TenantContext = createContext<TenantContextType>({
  tenant: null,
  setTenant: () => {},
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { tenant, setTenant } = useStore();

  useEffect(() => {
    async function loadTenant() {
      try {
        const response = await api.get("/api/tenant/current");
        setTenant(response.data);
      } catch (error) {
        console.error("Failed to load tenant", error);
      }
    }

    if (!tenant) loadTenant();
  }, [tenant, setTenant]);

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
