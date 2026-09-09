export default function FilterChips({ active, onChange, counts = {} }) {
  const chips = ['All', 'Drafts', 'Scheduled', 'Published'];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {chips.map(chip => (
          <button
            key={chip}
            onClick={() => onChange(chip === 'Drafts' ? 'Draft' : chip)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
              (active === chip || (active === 'Draft' && chip === 'Drafts'))
                ? 'bg-ink text-white' 
                : 'bg-transparent border border-border-strong text-ink hover:bg-surface-sunken'
            }`}
          >
            {chip} {counts[chip] !== undefined && <span className="opacity-80">{counts[chip]}</span>}
          </button>
        ))}
      </div>
      
      <button className="text-[13px] font-semibold text-muted hover:text-ink transition-colors flex items-center gap-1">
        Sort · Recently edited <span className="text-[10px]">▼</span>
      </button>
    </div>
  );
}
