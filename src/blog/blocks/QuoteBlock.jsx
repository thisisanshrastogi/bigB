export default function QuoteBlock({ data, editing }) {
  const { text = '', attribution = '', variant = 'pull', avatar = '' } = data || {};

  if (!text) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Write a quote...
      </div>
    );
  }

  if (variant === 'rule') {
    return (
      <blockquote className="border-l-[3px] border-[#2C4035] pl-[26px] my-6">
        <p className="font-serif text-[26px] leading-[1.4] italic text-ink m-0">"{text}"</p>
        {attribution && (
          <footer className="mt-4 font-sans text-[15px] font-medium text-muted">
            — {attribution}
          </footer>
        )}
      </blockquote>
    );
  }

  if (variant === 'card') {
    return (
      <blockquote className="bg-[#C2E0D1] rounded-[22px] px-[30px] py-[26px] my-6">
        <p className="font-serif text-[26px] leading-[1.4] italic text-[#2C4035] m-0">"{text}"</p>
        {attribution && (
          <footer className="mt-6 flex items-center gap-3">
            {avatar && <img src={avatar} alt={attribution} className="w-8 h-8 rounded-full object-cover" />}
            <span className="font-sans text-[15px] font-medium text-[#2C4035]">— {attribution}</span>
          </footer>
        )}
      </blockquote>
    );
  }

  // pull (default)
  return (
    <blockquote className="border-y border-[#E2DFD5] py-[30px] my-10 flex flex-col items-center text-center relative">
      <div className="w-[5px] h-[5px] rounded-full bg-[#2C4035] mb-6" />
      <p className="font-serif text-[30px] md:text-[32px] leading-[1.3] md:leading-[1.35] italic text-ink m-0">"{text}"</p>
      {attribution && (
        <footer className="mt-6 font-sans text-[15px] font-medium text-muted">
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}
