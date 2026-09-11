import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FileText, Image as ImageIcon, LayoutTemplate, Settings, LogOut } from 'lucide-react';
import { ConfirmDialog } from '@/ui/Dialog';

export default function StudioSidebar({ user }) {
  const pathname = usePathname();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const isSuperadmin = user?.email === 'lizann@amalgamic.io' || user?.email === 'thisisanshrastogi@gmail.com';

  const navItems = [
    {
      label: 'Posts',
      href: '/studio',
      exact: true,
      Icon: FileText
    },
    {
      label: 'Media',
      href: '/studio/media',
      Icon: ImageIcon
    },
    {
      label: 'Templates',
      href: '/studio/templates',
      Icon: LayoutTemplate
    }
  ];

  if (isSuperadmin) {
    navItems.push({
      label: 'Settings',
      href: '/studio/settings',
      Icon: Settings
    });
  }

  return (
    <>
      <div className="w-[220px] bg-surface border-r border-border/50 h-[100dvh] flex flex-col p-4 shrink-0">
        <div className="mb-8 px-2 pt-2 flex items-center gap-3">
          <div className="logo-mark shrink-0 scale-90" />
          <h2 className="text-[14px] font-bold tracking-wide text-ink uppercase">BigB Studio</h2>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-[13px] ${isActive
                  ? 'bg-surface-sunken text-ink font-semibold'
                  : 'text-muted-soft font-medium hover:bg-black/5 hover:text-ink'
                  }`}
              >
                <item.Icon size={16} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => setShowSignOutDialog(true)}
            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-surface-sunken transition-colors text-left group"
          >
            {user?.image ? (
              <img src={user.image} alt={user.name || "User"} className="w-7 h-7 rounded-full shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-accent text-surface flex items-center justify-center font-bold text-[11px] shrink-0">
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13px] font-semibold text-ink truncate leading-tight">
                {user?.name || 'Admin'}
              </span>
              <span className="text-[11px] text-muted-soft truncate mt-0.5">
                {user?.email || 'admin@amalgamic.io'}
              </span>
            </div>
            <LogOut size={14} strokeWidth={1.5} className="text-muted-soft shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showSignOutDialog}
        onClose={() => setShowSignOutDialog(false)}
        onConfirm={() => signOut({ callbackUrl: '/studio/login' })}
        title="Sign Out"
        description="Are you sure you want to sign out of the BigB Studio? You will need to authenticate with Google again to re-enter."
        confirmText="Sign Out"
      />
    </>
  );
}
