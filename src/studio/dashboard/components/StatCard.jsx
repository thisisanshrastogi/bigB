export default function StatCard({ title, value, highlight = false }) {
  return (
    <div className={`p-6 rounded-[22px] flex flex-col justify-between transition-colors shadow-sm ${
      highlight 
        ? 'bg-accent border border-accent text-surface' 
        : 'bg-surface border border-border/60 hover:border-border-strong text-ink'
    }`}>
      <h3 className={`text-[13px] font-bold mb-3 ${highlight ? 'text-surface/80' : 'text-ink'}`}>
        {title}
      </h3>
      <span className="text-4xl font-serif">{value}</span>
    </div>
  );
}
