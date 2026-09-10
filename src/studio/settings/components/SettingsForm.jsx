'use client';

import AdminWhitelist from './AdminWhitelist';

export default function SettingsForm({ session }) {
  const isSuperadmin = session?.user?.email === 'lizann@amalgamic.io' || session?.user?.email === 'thisisanshrastogi@gmail.com';
  
  return (
    <div className="space-y-10">
      {isSuperadmin ? (
        <AdminWhitelist />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-serif text-brand font-semibold mb-2">No Settings Available</h2>
          <p className="text-sm text-muted-soft max-w-sm">
            You do not have the required permissions to manage settings for the BigB Studio. 
            Only super-administrators can modify site configuration and manage the whitelist.
          </p>
        </div>
      )}
    </div>
  );
}
