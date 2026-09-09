import NextAuth from "next-auth"
// In a complete implementation we'd use Nodemailer or Resend provider for magic links
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Developer Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "lizann@amalgamic.io" }
      },
      async authorize(credentials) {
        if (credentials.email === "lizann@amalgamic.io") {
          return { id: "1", name: "Lizann", email: "lizann@amalgamic.io" }
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/studio/login",
  }
})
