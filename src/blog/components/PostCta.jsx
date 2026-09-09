export default function PostCta() {
  return (
    <div className="my-4 p-8 md:p-10 bg-accent rounded-[24px] text-white flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 shadow-[0_8px_32px_rgba(44,64,53,0.25)]">
      <div className="flex-1">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60 mb-2">
          Amalgamic
        </div>
        <h3 className="font-serif text-2xl md:text-[28px] leading-[1.25] font-bold mb-2">
          Maximize your credit card rewards — automatically.
        </h3>
        <p className="text-[15px] text-white/70 leading-[1.6]">
          Connect your cards, and let Amalgamic track credits, match purchases, and remind you before benefits expire.
        </p>
      </div>
      <div className="shrink-0">
        <a
          href="https://cards.amalgamic.io/auth/signin"
          className="inline-block px-7 py-3.5 bg-white text-accent rounded-full font-bold text-[15px] hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
        >
          Try for free →
        </a>
      </div>
    </div>
  );
}
