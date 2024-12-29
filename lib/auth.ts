import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import WaitlistUser from "@/models/WaitlistUser";
import connectDB from "./mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const email = credentials.email.toLowerCase();
        const isAdminEmail = email === process.env.ADMIN_EMAIL?.toLowerCase();

        await connectDB();

        // For admin email, we're more lenient
        const query = isAdminEmail
          ? { email }
          : { email, isVerified: true };

        const user = await WaitlistUser.findOne(query);

        if (!user) {
          return null;
        }

        // If this is admin email but not yet set up as admin
        if (isAdminEmail && user.role !== "admin") {
          await WaitlistUser.updateOne(
            { _id: user._id },
            { 
              $set: { 
                role: "admin",
                isVerified: true,
                verifiedAt: user.verifiedAt || new Date()
              }
            }
          );
          user.role = "admin";
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
