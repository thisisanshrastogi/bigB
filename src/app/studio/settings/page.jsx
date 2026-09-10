import SettingsForm from '@/studio/settings/components/SettingsForm';
import { auth } from '@/lib/auth';

export const metadata = {
  title: 'Settings | Amalgamic Studio',
};

export default async function StudioSettingsPage() {
  const session = await auth();

  return (
    <div className="w-full max-w-[1240px] mx-auto min-h-screen bg-paper py-12 px-[clamp(20px,5vw,76px)] animate-slide-in">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-[30px] md:text-[34px] font-serif text-ink tracking-tight">Settings</h1>
      </div>

      <div className="bg-surface rounded-[22px] shadow-sm border border-border/50 p-8 md:p-10 max-w-3xl">
        <SettingsForm session={session} />
      </div>
    </div>
  );
}
