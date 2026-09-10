import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { mongoStore } from "./content/mongoDriver"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, account, profile }) {
      // 1. Superadmin check
      if (user.email === "lizann@amalgamic.io" || user.email === "thisisanshrastogi@gmail.com") {
        return true;
      }

      // 2. Whitelist check
      try {
        const admins = await mongoStore.getAdmins();
        if (admins.includes(user.email)) {
          return true;
        }
      } catch (err) {
        console.error("Error checking admin whitelist:", err);
      }

      // Reject sign-in, redirect to unauthorized
      return "/studio/unauthorized";
    }
  }
})
