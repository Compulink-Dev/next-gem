// middleware.ts
import { auth } from '@/lib/auth';
import { Tenant } from '@/models/Tenant';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host');
  const subdomain = getSubdomain(host);

  // Public routes
  if (pathname.startsWith('/signin') || pathname.startsWith('/api/public')) {
    return NextResponse.next();
  }

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (!session?.user?.isAdmin) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }

  // Tenant routes
  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    if (!session) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    const tenant = await Tenant.findOne({ subdomain });
    if (!tenant) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Verify user has access to this tenant
    if (!session.user.tenants.includes(tenant._id.toString())) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    const response = NextResponse.next();
    response.cookies.set('current-tenant', tenant._id.toString());
    return response;
  }

  return NextResponse.next();
}

function getSubdomain(host: string | null) {
  if (!host) return null;
  const parts = host.split('.');
  if (parts.length > 2) return parts[0];
  return null;
}