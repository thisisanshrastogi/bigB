import { signIn } from "@/lib/auth";

export const metadata = {
  title: "Login | Amalgamic Studio",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-surface-sunken relative overflow-hidden">

      <div className="w-full max-w-[400px] p-8 z-10">
        <div className="bg-surface rounded-3xl premium-shadow p-10 flex flex-col items-center text-center border border-border/50 relative overflow-hidden">
          {/* Subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#64B387] to-transparent opacity-50" />

          <div className="logo-mark shrink-0 scale-150 shadow-sm mb-8" />

          <h1 className="text-2xl font-serif text-brand font-bold mb-2">Welcome Back</h1>
          <p className="text-[14px] text-muted-soft mb-8 max-w-[28ch] leading-relaxed">
            Sign in to the BigB Studio to manage your blog and content.
          </p>

          {error && (
            <div className="w-full bg-red-50 text-red-600 text-[13px] font-medium px-4 py-3 rounded-lg mb-6 border border-red-100">
              {error === 'AccessDenied' ? 'You do not have permission to access the studio.' : 'An error occurred during sign in.'}
            </div>
          )}

          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/studio" })
            }}
            className="w-full"
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-surface border border-border-strong text-ink hover:bg-surface-sunken transition-colors px-6 py-3.5 rounded-xl text-[14px] font-semibold shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </form>
        </div>
        <p className="text-center text-[12px] text-muted-soft mt-8">
          Secured by Amalgamic Access
        </p>
      </div>
    </div>
  );
}
