import SettingsForm from '@/studio/settings/components/SettingsForm';

export const metadata = {
  title: 'Settings | Amalgamic Studio',
};

export default function StudioSettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h1 className="text-3xl font-serif text-brand font-bold">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-border p-8">
        <SettingsForm />
      </div>
    </div>
  );
}
