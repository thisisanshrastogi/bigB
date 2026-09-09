export default function FilterChips({ active, onChange, counts = {} }) {
  const chips = ['All', 'Drafts', 'Scheduled', 'Published'];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {chips.map(chip => (
          <button
            key={chip}
            onClick={() => onChange(chip === 'Drafts' ? 'Draft' : chip)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 ${
              (active === chip || (active === 'Draft' && chip === 'Drafts'))
                ? 'bg-ink text-surface shadow-sm' 
                : 'bg-surface border border-border text-muted hover:text-ink hover:bg-surface-sunken hover:border-border-strong'
            }`}
          >
            {chip} {counts[chip] !== undefined && <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              (active === chip || (active === 'Draft' && chip === 'Drafts')) ? 'bg-surface/20' : 'bg-surface-sunken text-muted'
            }`}>{counts[chip]}</span>}
          </button>
        ))}
      </div>
      
      <button className="text-[13px] font-semibold text-muted hover:text-ink transition-colors flex items-center gap-1">
        Sort · Recently edited <span className="text-[10px]">▼</span>
      </button>
    </div>
  );
}
