// lib/auth.ts
import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDB } from './db';
import { User as UserModel } from '@/models/User';

// Extend NextAuth types
declare module 'next-auth' {
    interface User {
      id: string;
      isAdmin: boolean;
      tenants: string[];
      currentTenant?: string; // Currently active tenant
    }
  
    interface Session extends DefaultSession {
      user: {
        id: string;
        isAdmin: boolean;
        tenants: string[];
        currentTenant?: string; // Currently active tenant
      } & DefaultSession['user'];
    }
  }
  

export const auth = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenant: { label: 'Tenant', type: 'text' }
        
      },
      async authorize(credentials) {
        await connectToDB();
        
        const user = await UserModel.findOne({ email: credentials?.email });
        
        if (!user) return null;
        
        const isValid = await user.comparePassword(credentials?.password || '');
        
        if (!isValid) return null;
        
        // Check if user has access to the tenant
        if (credentials?.tenant && !user.tenants.includes(credentials.tenant)) {
          return null;
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          tenants: user.tenants,
          currentTenant: credentials?.tenant || user.tenants[0]
        } 
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.tenants = user.tenants;
        token.currentTenant = user.currentTenant;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.tenants = token.tenants as string[];
        session.user.currentTenant = token.currentTenant as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});