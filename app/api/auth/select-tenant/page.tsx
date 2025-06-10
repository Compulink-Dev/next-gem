// app/api/auth/select-tenant/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { User } from "@/models/User";
import { Tenant } from "@/models/Tenant";

export async function POST(request: Request) {
  const session = await auth();
  const { tenantId } = await request.json();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Verify user has access to this tenant
  if (!session.user.tenants.includes(tenantId)) {
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
  }

  // Update user's current tenant
  await User.findByIdAndUpdate(session.user.id, { currentTenant: tenantId });

  // Get tenant subdomain for redirect
  const tenant = await Tenant.findById(tenantId);
  const redirectUrl = `http://${tenant?.subdomain}.yourdomain.com/dashboard`;

  return NextResponse.json({ redirectUrl });
}
