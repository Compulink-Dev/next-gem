import { create } from 'zustand';

interface Tenant {
  name: string;
  subdomain: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  customDomain?: string;
  _id?: string;
}

interface TenantStore {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
}

export const useStore = create<TenantStore>((set) => ({
  tenant: null,
  setTenant: (tenant) => set({ tenant }),
}));
