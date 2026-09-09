export default function DeviceSwitch({ active, onChange }) {
  return (
    <div className="flex bg-surface rounded-md border border-border p-1 shadow-sm">
      <button 
        onClick={() => onChange('desktop')}
        className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${active === 'desktop' ? 'bg-accent-tint text-accent' : 'text-muted hover:text-ink'}`}
        title="Desktop (1280px)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>
      <button 
        onClick={() => onChange('tablet')}
        className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${active === 'tablet' ? 'bg-accent-tint text-accent' : 'text-muted hover:text-ink'}`}
        title="Tablet (834px)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>
      <button 
        onClick={() => onChange('mobile')}
        className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors flex items-center gap-2 ${active === 'mobile' ? 'bg-accent-tint text-accent' : 'text-muted hover:text-ink'}`}
        title="Mobile (390px)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
}
