// app/api/auth/signin/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { User } from '@/models/User';
import { Tenant } from '@/models/Tenant';

export async function POST(request: Request) {
  const { email, password, tenant } = await request.json();

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // If tenant specified, verify access
    if (tenant) {
      const tenantObj = await Tenant.findOne({ subdomain: tenant });
      if (!tenantObj || !user.tenants.includes(tenantObj._id.toString())) {
        return NextResponse.json(
          { message: 'Access denied to this tenant' },
          { status: 403 }
        );
      }
      user.currentTenant = tenantObj._id;
      await user.save();
    }

    // Create session
    const session = await auth();
    await session.signIn('credentials', {
      email,
      password,
      tenant,
      redirect: false
    });

    // Determine redirect URL
    let redirectUrl = '/dashboard';
    if (tenant) {
      redirectUrl = `http://${tenant}.yourdomain.com/dashboard`;
    } else if (user.currentTenant) {
      const tenantObj = await Tenant.findById(user.currentTenant);
      if (tenantObj) {
        redirectUrl = `http://${tenantObj.subdomain}.yourdomain.com/dashboard`;
      }
    }

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: 'Sign in failed' },
      { status: 500 }
    );
  }
}