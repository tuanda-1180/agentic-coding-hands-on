import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials } from "@/app/lib/auth/users";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    // Google OAuth — primary sign-in for the Login screen. All Google accounts
    // are allowed (no domain/allowlist restriction). Account linking is enabled
    // so a Google login reuses an existing account with the same verified email.
    Google({
      allowDangerousEmailAccountLinking: true,
      // Always show the Google account chooser, even when a Google session
      // already exists — so logging out of the app and back in lets the user
      // pick an account instead of silently reusing the active one.
      authorization: { params: { prompt: "select_account" } },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const user = await verifyCredentials(
          credentials.email,
          credentials.password
        );

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      // Persist role into JWT on sign-in. Google OAuth users have no role on
      // their profile, so default them to "regular".
      if (user) {
        token.role = user.role ?? "regular";
      }
      return token;
    },
    session({ session, token }) {
      // Expose role to session (client + server components). The cast is needed
      // because next-auth's JWT has an index signature that widens token.role.
      if (token.role) {
        session.user.role = token.role as "regular" | "admin";
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
