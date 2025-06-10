// app/[tenant]/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Tenant } from "@/models/Tenant";
import { getSubdomain } from "@/lib/utils";
import DashboardOverview from "../_components/DashboardOverview";

export default async function TenantDashboard() {
  const session = await auth();
  const subdomain = getSubdomain();

  if (!session) {
    redirect("/signin");
  }

  const tenant = await Tenant.findOne({ subdomain });

  if (!tenant) {
    redirect("/signin");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DashboardOverview tenant={tenant} />
    </div>
  );
}
