// Reminder: Run 'pnpm add next-auth' if you haven't already.
import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ALLOWED_EMAILS } from "@/lib/auth-middleware";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      empId: string;
      firstName: string;
      lastName: string;
    }
  }
  
  interface User {
    email: string;
    empId: string;
    firstName: string;
    lastName: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        empId: { label: "Employee ID", type: "text", placeholder: "Enter your employee ID" },
        firstName: { label: "First Name", type: "text", placeholder: "Enter your first name" },
        lastName: { label: "Last Name", type: "text", placeholder: "Enter your last name" },
      },
      async authorize(credentials: Record<string, string> | undefined): Promise<User | null> {
        if (
          credentials?.email &&
          credentials?.empId &&
          credentials?.firstName &&
          credentials?.lastName &&
          ALLOWED_EMAILS.includes(credentials.email)
        ) {
          return {
            id: credentials.email,
            email: credentials.email,
            empId: credentials.empId,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
          } as User;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.empId = token.empId as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.email = user.email;
        token.empId = user.empId;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
