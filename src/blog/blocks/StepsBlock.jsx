export default function StepsBlock({ data, editing }) {
  const { steps = [], start = 1, variant = 'numbered-circle' } = data || {};

  if (!steps || steps.length === 0) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add sequence steps...
      </div>
    );
  }

  return (
    <div className="flex flex-col my-10 relative">
      {steps.map((step, i) => {
        const num = start + i;
        const isLast = i === steps.length - 1;

        if (variant === 'timeline') {
          return (
            <div key={i} className="flex gap-6 relative">
              {/* Timeline marker & connector */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-[18px] h-[18px] rounded-full bg-[#2C4035] mt-[6px] shrink-0 border-[4px] border-white z-10" />
                {!isLast && <div className="w-[2px] bg-[#E2DFD5] flex-1 -mt-1 -mb-2" />}
              </div>
              
              <div className={`flex-1 pb-10 ${isLast ? 'pb-0' : ''}`}>
                {step.title && (
                  <h3 className="font-serif text-[26px] md:text-[30px] leading-[1.3] text-ink m-0 mb-3">
                    {step.title}
                  </h3>
                )}
                {step.body && (
                  <p className="font-sans text-[18.5px] leading-[1.8] text-[#2E2B25] m-0 mb-4 whitespace-pre-wrap">
                    {step.body}
                  </p>
                )}
                {step.image && (
                  <img src={step.image} alt={step.title} className="w-full rounded-[20px] mt-4 object-cover max-h-[400px]" />
                )}
              </div>
            </div>
          );
        }

        // numbered-circle (default)
        return (
          <div key={i} className="flex gap-[20px] md:gap-[26px] mb-12 last:mb-0">
            <div className="w-[44px] h-[44px] md:w-[54px] md:h-[54px] rounded-full bg-[#2C4035] text-white flex items-center justify-center font-serif text-[20px] md:text-[24px] shrink-0 mt-1">
              {num}
            </div>
            
            <div className="flex-1">
              {step.title && (
                <h3 className="font-serif text-[26px] md:text-[30px] leading-[1.3] text-ink m-0 mb-3">
                  {step.title}
                </h3>
              )}
              {step.body && (
                <p className="font-sans text-[18.5px] leading-[1.8] text-[#2E2B25] m-0 mb-4 whitespace-pre-wrap">
                  {step.body}
                </p>
              )}
              {step.image && (
                <img src={step.image} alt={step.title} className="w-full rounded-[20px] mt-4 object-cover max-h-[400px]" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
