export default function SourcesBlock({ data, editing }) {
  const { 
    items = [], 
    title = 'Sources', 
    numbered = true 
  } = data || {};

  if (!items || items.length === 0) {
    return (
      <div className="border border-dashed border-border-strong py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add sources...
      </div>
    );
  }

  const ListTag = numbered ? 'ol' : 'ul';
  const listClass = numbered ? 'list-decimal' : 'list-disc';

  return (
    <div className="my-10 pt-6 border-t border-border">
      {title && (
        <h4 className="font-sans font-bold text-[14px] text-ink uppercase tracking-[0.1em] mb-4">
          {title}
        </h4>
      )}
      <ListTag className={`${listClass} pl-5 m-0 flex flex-col gap-2`}>
        {items.map((item, index) => (
          <li key={index} className="font-sans text-[14px] leading-[1.6] text-muted pl-1">
            {item.url ? (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted hover:text-ink underline decoration-border hover:decoration-highlight underline-offset-4 transition-colors"
                onClick={e => editing && e.preventDefault()}
              >
                {item.text}
              </a>
            ) : (
              <span>{item.text}</span>
            )}
          </li>
        ))}
      </ListTag>
    </div>
  );
}
