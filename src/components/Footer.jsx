import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="py-12 md:py-24 bg-paper border-t border-border px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <Logo />
          <p className="text-sm text-muted mt-6 max-w-xs leading-relaxed">
            The credit card assistant of your dreams.
          </p>
          <p className="text-xs text-muted mt-12">© 2026 Amalgamic Inc.</p>
        </div>
        <div className="gap-12 sm:gap-20 md:col-span-3 flex flex-row sm:flex-row-reverse">

          {/* <div>
          <h4 className="font-bold text-ink text-[13px] uppercase tracking-widest mb-6">Product</h4>
          <div className="flex flex-col gap-4 text-sm text-muted">
            <Link to="/#features" className="hover:text-ink transition-colors">Features</Link>
            <Link to="#" className="hover:text-ink transition-colors">Pricing</Link>
            <a href="https://cards.amalgamic.io/auth/signin/dashboard" className="hover:text-ink transition-colors">Sign In</a>
          </div>
        </div> */}

          <div>
            <h4 className="font-bold text-ink text-[13px] uppercase tracking-widest mb-6">Company</h4>
            <div className="flex flex-col gap-5 text-sm text-muted">
              <Link to="/about" className="hover:text-ink transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-ink transition-colors">Contact</Link>
              <Link to="/privacy-policy" className="hover:text-ink transition-colors">Privacy Policy</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-ink text-[13px] uppercase tracking-widest mb-6">Resources</h4>
            <div className="flex flex-col gap-5 text-sm text-muted">
              <Link to="/faq" className="hover:text-ink transition-colors">FAQ</Link>
              <Link to="/supported-banks" className="hover:text-ink transition-colors">Supported Banks</Link>
              {/* <Link to="#" className="hover:text-ink transition-colors">Reward Calculator</Link> */}
              <a href="https://cards.amalgamic.io/auth/signin" className="hover:text-ink transition-colors">Sign In</a>

            </div>
          </div>
        </div>

      </div>
      <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 text-[13px] font-bold text-muted">
          <a href="https://www.linkedin.com/company/amalgamic-io/" target="_blank" className="hover:text-ink transition-colors">LinkedIn</a>
          <a href="https://x.com/amalgamic_io" target="_blank" className="hover:text-ink transition-colors">Twitter</a>
          <a href="mailto:support@amalgamic.io" target="_blank" className="hover:text-ink transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}
