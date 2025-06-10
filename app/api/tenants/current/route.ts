// app/api/tenant/current/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Tenant } from '@/models/Tenant';

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tenantId = session.user.currentTenant;
  if (!tenantId) {
    return NextResponse.json({ error: 'No tenant selected' }, { status: 400 });
  }

  const tenant = await Tenant.findById(tenantId).lean();
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  const { _id, name, subdomain, plan } = tenant;
  return NextResponse.json({ id: _id.toString(), name, subdomain, plan });
  
}