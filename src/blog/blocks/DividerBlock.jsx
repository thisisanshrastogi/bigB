export default function DividerBlock({ data }) {
  const { variant = 'rule', height = 'medium' } = data || {};

  if (variant === 'space') {
    const heightMap = {
      small: 'h-[24px]',
      medium: 'h-[48px]',
      large: 'h-[96px]',
    };
    return <div className={`w-full ${heightMap[height] || heightMap.medium}`} aria-hidden="true" />;
  }

  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center gap-[14px] py-8">
        <div className="w-[4px] h-[4px] rounded-full bg-ink" />
        <div className="w-[4px] h-[4px] rounded-full bg-ink" />
        <div className="w-[4px] h-[4px] rounded-full bg-ink" />
      </div>
    );
  }

  // rule (default)
  return <hr className="w-full border-t border-border my-8" />;
}
