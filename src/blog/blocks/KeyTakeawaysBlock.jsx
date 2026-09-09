export default function KeyTakeawaysBlock({ data, editing }) {
  const { 
    kicker = 'The short version', 
    items = [], 
    numbered = false, 
    variant = 'card' 
  } = data || {};

  if (!items || items.length === 0) {
    return (
      <div className="border border-dashed border-border-strong py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add key takeaways...
      </div>
    );
  }

  const containerClasses = variant === 'card' 
    ? "bg-surface border border-border rounded-[24px] p-8 my-8 shadow-sm"
    : "border-y border-border py-8 my-8";

  return (
    <div className={containerClasses}>
      {kicker && (
        <h4 className="font-sans text-[11px] font-[800] tracking-[0.12em] uppercase text-accent mb-6">
          {kicker}
        </h4>
      )}
      <ul className="flex flex-col gap-4 my-0 pl-0 list-none">
        {items.map((item, index) => {
          const text = typeof item === 'string' ? item : item.text;
          return (
            <li key={index} className="flex gap-4 items-start font-sans text-[16.5px] leading-[1.6] text-ink">
              {numbered ? (
                <div className="font-sans font-[800] text-accent text-[15px] pt-[2px] shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </div>
              ) : (
                <div className="w-[6px] h-[6px] rounded-full bg-accent mt-[10px] shrink-0" />
              )}
              <div className="flex-1 min-w-0">{text}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
