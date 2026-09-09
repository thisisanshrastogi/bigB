"use client";
import { useState } from 'react';

export default function NewsletterBlock({ data, editing }) {
  const { 
    heading = '', 
    body = '', 
    listId = '', 
    theme = 'mint',
    layout = 'center'
  } = data || {};

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  if (!heading && !body) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add newsletter content...
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) return;
    if (!email) return;

    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  const themeMap = {
    mint: {
      container: "bg-[#C2E0D1]",
      heading: "text-[#2C4035]",
      body: "text-[#4F5C52]",
      input: "bg-white border-[#E2DFD5] text-ink placeholder:text-muted focus:ring-[#2C4035]",
      button: "bg-[#2C4035] text-white hover:bg-[#1E2D25]",
      icon: "bg-[#2C4035] text-white"
    },
    ink: {
      container: "bg-[#1E1D19] border border-white/10",
      heading: "text-[#F5F2EA]",
      body: "text-[#B9B2A2]",
      input: "bg-white/5 border-white/10 text-[#F5F2EA] placeholder:text-white/40 focus:ring-[#F5F2EA]",
      button: "bg-[#F5F2EA] text-[#171613] hover:bg-white",
      icon: "bg-[#F5F2EA] text-[#171613]"
    },
    paper: {
      container: "bg-[#F5F2EA] border border-[#E2DFD5]",
      heading: "text-[#171613]",
      body: "text-[#6B6658]",
      input: "bg-white border-[#E2DFD5] text-[#171613] placeholder:text-[#8A8375] focus:ring-[#2C4035]",
      button: "bg-[#171613] text-white hover:bg-[#2E2B25]",
      icon: "bg-[#171613] text-white"
    },
    forest: {
      container: "bg-[#2C4035]",
      heading: "text-[#F5F2EA]",
      body: "text-[#C2E0D1]",
      input: "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-[#C2E0D1]",
      button: "bg-[#C2E0D1] text-[#2C4035] hover:bg-white",
      icon: "bg-[#C2E0D1] text-[#2C4035]"
    }
  };

  const currentTheme = themeMap[theme] || themeMap.mint;
  const isSplit = layout === 'split';

  const containerClass = `rounded-[22px] px-6 md:px-[40px] py-[40px] md:py-[48px] w-full mx-auto my-12 ${currentTheme.container}`;

  return (
    <div className={containerClass}>
      {status === 'success' ? (
        <div className="py-8 text-center">
          <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${currentTheme.icon}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className={`font-serif text-[24px] md:text-[28px] leading-[1.3] m-0 mb-2 ${currentTheme.heading}`}>
            You're subscribed
          </h3>
          <p className={`font-sans text-[16px] m-0 ${currentTheme.body}`}>
            Check your inbox for a welcome email.
          </p>
        </div>
      ) : (
        <div className={isSplit ? "grid md:grid-cols-2 gap-8 items-center text-left" : "text-center"}>
          <div>
            {heading && (
              <h3 className={`font-serif text-[28px] md:text-[32px] leading-[1.3] m-0 mb-4 ${currentTheme.heading}`}>
                {heading}
              </h3>
            )}
            {body && (
              <p className={`font-sans text-[16px] leading-[1.6] m-0 mb-8 ${isSplit ? 'md:mb-0' : 'max-w-[480px] mx-auto'} ${currentTheme.body}`}>
                {body}
              </p>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 relative ${isSplit ? 'w-full' : 'max-w-[440px] mx-auto'}`}>
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className={`w-full sm:flex-1 h-[56px] px-6 rounded-full border focus:outline-none focus:ring-2 font-sans text-[16px] transition-all disabled:opacity-50 min-w-0 ${currentTheme.input}`}
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className={`w-full sm:w-auto h-[56px] px-10 rounded-full font-sans font-bold text-[16px] transition-colors flex items-center justify-center whitespace-nowrap disabled:opacity-50 shrink-0 ${currentTheme.button}`}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
            {editing && !listId && (
              <div className="absolute -bottom-8 left-0 right-0 text-[11px] text-red-500 text-center">
                Warning: Missing ESP List ID
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
