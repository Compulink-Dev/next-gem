// app/api/tenant/switch/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { User } from '@/models/User';

export async function POST(request: Request) {
  const session = await auth();
  const { tenantId } = await request.json();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify user has access to this tenant
  if (!session.user.tenants.includes(tenantId)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // Update user's current tenant
  await User.findByIdAndUpdate(session.user.id, { currentTenant: tenantId });

  return NextResponse.json({ success: true });
}