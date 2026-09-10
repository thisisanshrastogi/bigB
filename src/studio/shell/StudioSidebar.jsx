import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FileText, Image as ImageIcon, LayoutTemplate, Settings, LogOut } from 'lucide-react';

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
      <div className="w-[240px] bg-surface-sunken border-r border-border/50 h-[100dvh] flex flex-col p-4 shrink-0">
        <div className="mb-8 px-2 pt-2 flex items-center gap-3">
          <div className="logo-mark shrink-0 scale-100 shadow-sm" />
          <h2 className="text-lg font-bold tracking-tight text-ink">BigB Studio</h2>
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
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-[13px] ${isActive
                  ? 'bg-surface shadow-sm border border-border/50 text-ink font-semibold'
                  : 'text-muted-soft font-medium hover:bg-black/5 hover:text-ink border border-transparent'
                  }`}
              >
                <item.Icon size={16} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => setShowSignOutDialog(true)}
            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-black/5 transition-colors text-left border border-transparent hover:border-border/30 shadow-sm hover:shadow-none"
          >
            {user?.image ? (
              <img src={user.image} alt={user.name || "User"} className="w-8 h-8 rounded-full shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent text-surface flex items-center justify-center font-bold text-[12px] shrink-0">
                {(user?.name || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13px] font-semibold text-ink truncate leading-tight">
                {user?.name || 'Admin User'}
              </span>
              <span className="text-[11px] text-muted-soft truncate mt-0.5">
                {user?.email || 'admin@amalgamic.io'}
              </span>
            </div>
            <LogOut size={14} className="text-muted-soft shrink-0" />
          </button>
        </div>
      </div>

      {showSignOutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand/20 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl premium-shadow p-6 w-full max-w-sm border border-border/50 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-serif text-brand font-bold mb-2">Sign Out</h3>
            <p className="text-[14px] text-muted-soft mb-6 leading-relaxed">
              Are you sure you want to sign out of the BigB Studio? You will need to authenticate with Google again to re-enter.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowSignOutDialog(false)}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-ink hover:bg-surface-sunken transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => signOut({ callbackUrl: '/studio/login' })}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-ink text-surface shadow-sm hover:bg-ink/90 transition-colors flex items-center gap-2"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
