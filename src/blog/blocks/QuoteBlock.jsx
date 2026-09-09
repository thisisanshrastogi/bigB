export default function QuoteBlock({ data, editing }) {
  const { text = '', attribution = '', variant = 'pull', avatar = '', theme = 'mint' } = data || {};

  if (!text) {
    return (
      <div className="border border-dashed border-border-strong py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Write a quote...
      </div>
    );
  }

  const themeMap = {
    paper: 'bg-paper text-ink',
    dark: 'bg-ink text-surface',
    forest: 'bg-accent text-surface',
    mint: 'bg-highlight text-accent',
  };

  const currentTheme = themeMap[theme] || themeMap.mint;

  if (variant === 'rule') {
    return (
      <blockquote className="border-l-[3px] border-accent pl-[26px] my-6">
        <p className="font-serif text-[26px] leading-[1.4] italic text-ink m-0">"{text}"</p>
        {attribution && (
          <footer className="mt-4 font-sans text-[15px] font-bold tracking-wide text-muted">
            {attribution}
          </footer>
        )}
      </blockquote>
    );
  }

  if (variant === 'card') {
    return (
      <blockquote className={`${currentTheme} rounded-[22px] px-[30px] py-[26px] my-6`}>
        <p className="font-serif text-[26px] leading-[1.4] italic m-0 opacity-90">"{text}"</p>
        {attribution && (
          <footer className="mt-6 flex items-center gap-3">
            {avatar && <img src={avatar} alt={attribution} className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20" />}
            <span className="font-sans text-[14px] font-bold tracking-wide opacity-80">{attribution}</span>
          </footer>
        )}
      </blockquote>
    );
  }

  // pull (default)
  return (
    <blockquote className="border-y border-border py-[40px] my-10 flex flex-col items-center text-center relative px-8">
      <div className="absolute top-[-16px] bg-paper px-4 text-accent/20">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" /></svg>
      </div>
      <p className="font-serif text-[30px] md:text-[32px] leading-[1.3] md:leading-[1.35] italic text-ink m-0 mt-4">
        {text}
      </p>
      {attribution && (
        <footer className="mt-8 font-sans text-[15px] font-bold tracking-wide text-muted">
          {attribution}
        </footer>
      )}
    </blockquote>
  );
}
