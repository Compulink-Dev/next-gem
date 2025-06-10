// app/api/auth/tenants/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Tenant } from '@/models/Tenant';

export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const tenants = await Tenant.find({
    _id: { $in: session.user.tenants }
  }).lean();

  return NextResponse.json({ tenants });
}
