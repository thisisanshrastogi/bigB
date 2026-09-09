export default function StatCard({ title, value, highlight = false }) {
  return (
    <div className={`p-6 rounded-[22px] flex flex-col justify-between ${highlight ? 'bg-accent-tint border-accent-tint' : 'bg-surface shadow-sm border border-border/50'}`}>
      <h3 className="text-[13px] font-bold text-ink mb-3">{title}</h3>
      <span className="text-[34px] font-serif text-ink">{value}</span>
    </div>
  );
}
