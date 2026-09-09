'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StudioSidebar() {
  const pathname = usePathname();

  const navItems = [
    { 
      label: 'Posts', 
      href: '/studio', 
      exact: true,
      icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' 
    },
    { 
      label: 'Media', 
      href: '/studio/media', 
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' 
    },
    { 
      label: 'Templates', 
      href: '/studio/templates', 
      icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' 
    },
    { 
      label: 'Settings', 
      href: '/studio/settings', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' 
    },
  ];

  return (
    <div className="w-[260px] bg-[#FAFAFA] border-r border-border h-screen flex flex-col p-4 shrink-0 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      <div className="mb-10 px-3 pt-2">
        <h2 className="text-2xl font-bold font-serif text-brand">Blog Studio</h2>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${isActive ? 'bg-accent/10 text-accent font-semibold' : 'text-muted hover:bg-black/5 hover:text-ink'}`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto border-t border-border pt-4 px-2">
        <div className="flex items-center gap-3 py-2">
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
            L
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-ink truncate">Lizann</span>
            <span className="text-xs text-muted truncate">lizann@amalgamic.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
