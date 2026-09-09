export default function StatusPill({ status }) {
  const styles = {
    published: 'bg-accent/10 text-accent border border-accent/20',
    draft: 'bg-warn-bg text-warn-ink border border-warn-ink/20',
    scheduled: 'bg-blue-50 text-blue-700 border border-blue-200'
  };

  const style = styles[status] || 'bg-surface-sunken text-muted border border-border';

  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize tracking-wide ${style}`}>
      {status}
    </span>
  );
}
