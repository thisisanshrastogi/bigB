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
      <div className="border border-dashed border-border-strong py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add newsletter content...
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) return;
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error('Failed to subscribe');
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const themeMap = {
    mint: {
      container: "bg-highlight",
      heading: "text-accent",
      body: "text-accent/80",
      input: "bg-surface border-border text-ink placeholder:text-muted focus:ring-accent",
      button: "bg-accent text-surface hover:bg-accent/90",
      icon: "bg-accent text-surface"
    },
    sunken: {
      container: "bg-surface-sunken border border-rule/50",
      heading: "text-ink",
      body: "text-ink/80",
      input: "bg-surface border-rule text-ink placeholder:text-muted focus:border-forest/50 focus:ring-forest/10",
      button: "bg-forest text-surface hover:bg-forest/90 shadow-sm",
      icon: "bg-forest text-surface"
    },
    ink: {
      container: "bg-ink border border-white/10",
      heading: "text-paper",
      body: "text-paper/70",
      input: "bg-white/5 border-white/10 text-paper placeholder:text-white/40 focus:border-white/30 focus:ring-white/10",
      button: "bg-paper text-ink hover:bg-white",
      icon: "bg-paper text-ink"
    },
    paper: {
      container: "bg-paper border border-border",
      heading: "text-ink",
      body: "text-muted",
      input: "bg-surface border-rule text-ink placeholder:text-muted focus:border-forest/50 focus:ring-forest/10",
      button: "bg-ink text-surface hover:bg-ink/90",
      icon: "bg-ink text-surface"
    },
    forest: {
      container: "bg-forest",
      heading: "text-surface",
      body: "text-surface/70",
      input: "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/30 focus:ring-white/10",
      button: "bg-surface text-forest hover:bg-surface-sunken shadow-sm",
      icon: "bg-surface text-forest"
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
            You have been added to the mailing list.
          </h3>
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
            {status === 'error' && (
              <div className="absolute -bottom-8 left-0 right-0 text-[13px] text-red-400 text-center">
                Something went wrong. Please try again.
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
