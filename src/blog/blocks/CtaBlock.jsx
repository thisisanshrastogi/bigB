export default function CtaBlock({ data, editing }) {
  const { 
    heading = '', 
    body = '', 
    buttonLabel = 'Click Here', 
    href = '#', 
    theme = 'ink', 
    layout = 'row' 
  } = data || {};

  if (!heading && !body) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add CTA content...
      </div>
    );
  }

  let containerClass = '';
  let headingClass = 'font-serif leading-[1.2] m-0 mb-3 text-[27px] md:text-[38px] ';
  let bodyClass = 'font-sans text-[15px] md:text-[17px] leading-[1.6] m-0 ';
  let buttonClass = 'inline-flex items-center justify-center font-sans font-bold text-[15px] px-6 py-3 rounded-full transition-colors whitespace-nowrap ';

  if (theme === 'ink') {
    containerClass = 'bg-[#171613] rounded-[24px] px-[32px] py-[36px]';
    headingClass += 'text-[#F5F2EA]';
    bodyClass += 'text-[#B9B2A2]';
    buttonClass += 'bg-[#F5F2EA] text-[#171613] hover:bg-white';
  } else if (theme === 'mint') {
    containerClass = 'bg-[#C2E0D1] rounded-[24px] px-[32px] py-[36px]';
    headingClass += 'text-[#2C4035]';
    bodyClass += 'text-[#4F5C52]';
    buttonClass += 'bg-[#2C4035] text-white hover:bg-[#1E2D25]';
  } else if (theme === 'outline') {
    containerClass = 'bg-transparent border border-[#D6CFBF] rounded-[24px] px-[32px] py-[36px]';
    headingClass += 'text-ink';
    bodyClass += 'text-muted';
    buttonClass += 'bg-ink text-white hover:bg-[#2E2B25]';
  }

  const layoutClass = layout === 'row' 
    ? 'flex flex-col md:flex-row md:items-center gap-6 md:gap-10'
    : 'flex flex-col gap-6 text-center items-center';

  return (
    <div className={`my-10 ${containerClass}`}>
      <div className={layoutClass}>
        <div className="flex-1">
          {heading && <h2 className={headingClass}>{heading}</h2>}
          {body && <p className={bodyClass}>{body}</p>}
        </div>
        <div className="shrink-0">
          <a 
            href={href} 
            className={buttonClass}
            onClick={(e) => editing && e.preventDefault()}
          >
            {buttonLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
