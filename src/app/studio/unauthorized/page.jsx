import Link from "next/link";
import { Lock } from "lucide-react";

export const metadata = {
  title: "Unauthorized | BigB Studio",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-surface-sunken relative overflow-hidden">

      <div className="w-full max-w-[400px] p-8 z-10">
        <div className="bg-surface rounded-3xl premium-shadow p-10 flex flex-col items-center text-center border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#8A5A2B] to-transparent opacity-30" />

          <div className="w-12 h-12 bg-warn-bg text-warn-ink rounded-xl flex items-center justify-center mb-6">
            <Lock size={24} strokeWidth={2.5} />
          </div>

          <h1 className="text-2xl font-serif text-brand font-bold mb-2">Access Denied</h1>
          <p className="text-[14px] text-muted-soft mb-8 max-w-[28ch] leading-relaxed">
            You do not have permission to access the BigB Studio. If you believe this is a mistake, please contact an administrator.
          </p>

          <Link
            href="/studio/login"
            className="w-full flex items-center justify-center bg-ink text-surface hover:bg-ink/90 transition-colors px-6 py-3.5 rounded-xl text-[14px] font-semibold shadow-sm"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
