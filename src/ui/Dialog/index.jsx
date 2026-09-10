'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function BaseDialog({ open, onClose, children, className = 'max-w-sm' }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Small delay to allow the DOM node to be created before animating in
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // Wait for the animation to complete before removing from DOM
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-ink/50 z-[9999] flex items-center justify-center p-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`bg-surface rounded-2xl p-6 w-full shadow-xl transition-all duration-200 ${className} ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function ConfirmDialog({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  icon = null
}) {
  return (
    <BaseDialog open={open} onClose={onClose}>
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-[18px] font-bold text-ink mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-[14px] text-muted-soft mb-6">
          {description}
        </p>
      )}
      <div className="flex gap-3 justify-end mt-2">
        <button 
          onClick={onClose} 
          disabled={isLoading}
          className="px-5 py-2 rounded-full border border-border-strong text-[13px] font-semibold text-ink hover:bg-surface-sunken disabled:opacity-50 transition-colors"
        >
          {cancelText}
        </button>
        <button 
          onClick={onConfirm} 
          disabled={isLoading}
          className={`px-5 py-2 rounded-full text-[13px] font-semibold text-surface flex items-center gap-2 disabled:opacity-50 transition-colors ${isDestructive ? 'bg-warn-ink hover:bg-warn-ink/90' : 'bg-ink hover:bg-ink/90'}`}
        >
          {isLoading && <span className="w-3.5 h-3.5 rounded-full border-2 border-surface/30 border-t-surface animate-spin" />}
          {confirmText}
        </button>
      </div>
    </BaseDialog>
  );
}
