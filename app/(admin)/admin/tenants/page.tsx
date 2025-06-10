// app/(admin)/tenants/page.tsx
import { Tenant } from "@/models/Tenant";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { CreateTenantButton } from "../../_components/CreateTenantButton";

async function getTenants() {
  const tenants = await Tenant.find().sort({ createdAt: -1 }).lean();
  return tenants;
}

export default async function TenantsPage() {
  const tenants = await getTenants();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <CreateTenantButton />
      </div>
      <DataTable columns={columns} data={tenants} />
    </div>
  );
}
