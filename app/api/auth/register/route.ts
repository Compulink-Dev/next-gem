// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import { Tenant } from '@/models/Tenant';
import bcrypt from 'bcryptjs'; await connectToDB();
import { connectToDB } from '@/lib/db';

export async function POST(request: Request) {
  try {

    await connectToDB();

    const { name, email, password, tenantName, subdomain, plan } = await request.json();

    // Check if subdomain is available
    const existingTenant = await Tenant.findOne({ subdomain });
    if (existingTenant) {
      return NextResponse.json(
        { message: 'Subdomain already taken' },
        { status: 400 }
      );
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create tenant
    const tenant = await Tenant.create({
      name: tenantName,
      subdomain,
      plan,
      isActive: true
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (automatically becomes admin of their own tenant)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      tenants: [tenant._id],
      currentTenant: tenant._id,
      isAdmin: true
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}