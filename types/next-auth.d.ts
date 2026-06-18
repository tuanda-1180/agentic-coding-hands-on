import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "regular" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "regular" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "regular" | "admin";
  }
}
