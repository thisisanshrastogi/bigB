"use client";
import React, { useEffect, useRef } from 'react';
import { animate, createTimeline, createScope, onScroll } from 'animejs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const root = useRef(null);
  const scope = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownAnim = useRef(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    scope.current = createScope({ root: root.current }).add(() => {
      // Orchestrated entrance: logo → links → CTA (timeline)
      const tl = createTimeline({ defaults: { ease: 'outExpo' } });

      tl.add('.nav-wrapper', {
        top: ['-80px', '24px'],
        opacity: [0, 1],
        duration: 420,
      })
        .add('.nav-logo', {
          opacity: [0, 1],
          translateX: [-10, 0],
          duration: 300,
        }, '-=400')
        .add('.nav-link', {
          opacity: [0, 1],
          translateY: [-8, 0],
          duration: 400,
          delay: (_, i) => i * 35,
        }, '-=350')
        .add('.nav-cta', {
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 400,
        }, '-=200');

      // Scroll-shrink: compact the nav on scroll
      const navEl = root.current?.querySelector('.nav-wrapper nav');
      const wrapperEl = root.current?.querySelector('.nav-wrapper');
      let scrolled = false;

      if (navEl && wrapperEl) {
        const handleScroll = () => {
          const shouldBeScrolled = window.scrollY > 40;
          if (shouldBeScrolled !== scrolled) {
            scrolled = shouldBeScrolled;
            
            if (scrolled) {
              animate(navEl, {
                paddingTop: 10,
                paddingBottom: 10,
                duration: 300,
                ease: 'outQuad',
              });
              animate(wrapperEl, {
                top: '12px',
                duration: 300,
                ease: 'outQuad',
              });
            } else {
              animate(navEl, {
                paddingTop: window.innerWidth < 768 ? 12 : 16,
                paddingBottom: window.innerWidth < 768 ? 12 : 16,
                duration: 300,
                ease: 'outQuad',
              });
              animate(wrapperEl, {
                top: '24px',
                duration: 300,
                ease: 'outQuad',
              });
            }
          }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.__navScrollHandler = handleScroll;
        // Initial check in case the page is already scrolled on load
        handleScroll();
      }

      // Cleanup listener when component unmounts
      // We will handle this in the useEffect return function instead
    });

    return () => {
      scope.current?.revert();
      const handleScroll = window.__navScrollHandler;
      if (handleScroll) {
        window.removeEventListener('scroll', handleScroll);
        delete window.__navScrollHandler;
      }
    };
  }, []);

  // Smooth scroll handler using Anime.js
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (pathname === '/') {
      const el = document.getElementById(targetId);
      if (el) {
        animate(document.scrollingElement || document.documentElement, {
          scrollTop: el.offsetTop - 100,
          duration: 800,
          ease: 'outExpo'
        });
      }
    } else {
      router.push(`/#${targetId}`);
    }
  };

  // Dropdown hover animations using Anime.js
  const handleMouseEnter = () => {
    if (!dropdownRef.current) return;
    if (dropdownAnim.current) dropdownAnim.current.cancel();

    dropdownRef.current.style.visibility = 'visible';
    dropdownRef.current.style.display = 'flex';

    dropdownAnim.current = animate(dropdownRef.current, {
      opacity: [0, 1],
      scale: [0.95, 1],
      translateY: [10, 0],
      duration: 300,
      ease: 'outExpo'
    });
  };

  const handleMouseLeave = () => {
    if (!dropdownRef.current) return;
    if (dropdownAnim.current) dropdownAnim.current.cancel();

    dropdownAnim.current = animate(dropdownRef.current, {
      opacity: 0,
      scale: 0.95,
      translateY: 10,
      duration: 200,
      ease: 'outExpo',
      onComplete: () => {
        if (dropdownRef.current) {
          dropdownRef.current.style.visibility = 'hidden';
          dropdownRef.current.style.display = 'none';
        }
      }
    });
  };

  return (
    <div ref={root}>
      <div className="nav-wrapper opacity-0 fixed left-1/2 -translate-x-1/2 w-[90%] max-w-[1300px] z-50" style={{ top: '-80px' }}>
        <nav className="bg-white px-5 py-3 md:px-8 md:py-4 rounded-full shadow-lg border border-black/5 flex items-center justify-between transition-shadow">
          <a href="https://amalgamic.io/" className="nav-logo opacity-0 hover:opacity-80 transition-opacity">
            <Logo />
          </a>

          <div className="hidden md:flex items-center gap-10 text-[15px] font-bold text-muted tracking-wide">

            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="nav-link opacity-0 flex items-center gap-1 px-2 py-2 hover:text-ink transition-all duration-300 relative group">
                Features <ChevronDown size={13} className="opacity-60 transition-transform duration-300 group-hover:rotate-180" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ink transition-all duration-300 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100" />
              </button>

              <div
                ref={dropdownRef}
                // Use left-1/2 and -ml-[104px] (half of w-52 which is 208px) instead of -translate-x-1/2 
                // to avoid AnimeJS overwriting the transform property during animation.
                className="absolute top-full left-1/2 -ml-[104px] mt-3 w-52 bg-white rounded-2xl shadow-xl border border-border/60 opacity-0 flex-col py-2 px-1 before:content-[''] before:absolute before:-top-3 before:left-0 before:w-full before:h-3"
                style={{ visibility: 'hidden', display: 'none', transformOrigin: 'top center' }}
              >

                <a
                  href="https://amalgamic.io/#assistant"
                  className="flex flex-col px-4 py-3 rounded-xl hover:bg-black/5 transition-colors"
                >
                  <span className="text-[13px] font-bold text-ink">Assistant</span>
                  <span className="text-[11px] text-muted mt-0.5 font-normal">Chat with your statements</span>
                </a>
                <a
                  href="https://amalgamic.io/#subscriptions"
                  className="flex flex-col px-4 py-3 rounded-xl hover:bg-black/5 transition-colors"
                >
                  <span className="text-[13px] font-bold text-ink">Subscriptions</span>
                  <span className="text-[11px] text-muted mt-0.5 font-normal">Manage recurring charges</span>
                </a>
                <a
                  href="https://amalgamic.io/#how-it-works"
                  className="flex flex-col px-4 py-3 rounded-xl hover:bg-black/5 transition-colors"
                >
                  <span className="text-[13px] font-bold text-ink">How it works</span>
                  <span className="text-[11px] text-muted mt-0.5 font-normal">Connect cards, automate claims</span>
                </a>
              </div>
            </div>

            <a href="https://amalgamic.io/about"
               className={`nav-link opacity-0 relative px-2 py-2 transition-all duration-300 flex flex-col items-center group ${pathname === '/about' ? 'text-ink font-bold' : 'hover:text-ink'}`}
            >
              About
              <span className={`absolute -bottom-1 w-1 h-1 rounded-full bg-ink transition-all duration-300 ${pathname === '/about' ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`} />
            </a>
            <a href="https://amalgamic.io/faq"
               className={`nav-link opacity-0 relative px-2 py-2 transition-all duration-300 flex flex-col items-center group ${pathname === '/faq' ? 'text-ink font-bold' : 'hover:text-ink'}`}
            >
              FAQ
              <span className={`absolute -bottom-1 w-1 h-1 rounded-full bg-ink transition-all duration-300 ${pathname === '/faq' ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`} />
            </a>
          </div>

          <div className="nav-cta opacity-0 flex items-center gap-4 md:gap-6">
            <a href="https://amalgamic.io/contact" className="text-[15px] font-bold text-ink hover:opacity-70 transition-opacity hidden sm:block">Contact</a>
            <a href="https://cards.amalgamic.io/auth/signin" className="bg-ink text-white px-5 py-2 md:px-6 md:py-2.5 rounded-full text-[15px] font-bold hover:opacity-80 transition-opacity shadow-sm inline-block text-center">
              Get Started
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
