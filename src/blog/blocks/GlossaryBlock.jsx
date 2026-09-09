export default function GlossaryBlock({ data }) {
  const { term = '', definition = '', layout = 'block' } = data;

  const emptyTerm = !term;
  const emptyDef = !definition;

  if (layout === 'inline') {
    return (
      <div className="my-8 py-4 border-y border-border flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
        <span className={`font-serif text-xl font-semibold text-ink shrink-0 ${emptyTerm ? 'opacity-30 italic' : ''}`}>
          {term || 'Term'}
        </span>
        {emptyDef ? (
          <span className="font-sans text-[17px] text-muted leading-[1.6] opacity-40 italic">Definition goes here...</span>
        ) : (
          <span
            className="font-sans text-[17px] text-muted leading-[1.6]"
            dangerouslySetInnerHTML={{ __html: definition }}
          />
        )}
      </div>
    );
  }

  // Block layout
  return (
    <div className="my-10 p-8 bg-surface-sunken rounded-2xl border border-border/50">
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className={`font-serif text-2xl font-semibold text-ink ${emptyTerm ? 'opacity-30 italic' : ''}`}>
          {term || 'Term'}
        </h3>
      </div>
      {emptyDef ? (
        <p className="font-sans text-[17px] text-muted leading-[1.7] opacity-40 italic">
          Write the definition in the inspector panel...
        </p>
      ) : (
        <div
          className="font-sans text-[17px] text-ink leading-[1.7]"
          dangerouslySetInnerHTML={{ __html: definition }}
        />
      )}
    </div>
  );
}
