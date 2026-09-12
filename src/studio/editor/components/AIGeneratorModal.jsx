import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEditor } from '@/studio/EditorProvider';
import { X, Fan, Type, CodeXml } from 'lucide-react';

// A simple syntax highlighter for JSON
const highlightJson = (jsonStr) => {
  if (!jsonStr) return '';
  return jsonStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let color = '#2c4035'; // default ink
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          color = '#8b5a2b'; // keys - brown
        } else {
          color = '#2d6a4f'; // string values - forest green
        }
      } else if (/true|false/.test(match)) {
        color = '#d97706'; // booleans - amber
      } else if (/null/.test(match)) {
        color = '#6b7280'; // null - gray
      } else {
        color = '#0284c7'; // numbers - blue
      }
      return `<span style="color: ${color}">${match}</span>`;
    });
};

export default function AIGeneratorModal({ isOpen, onClose }) {
  const { updatePost } = useEditor();
  const [mode, setMode] = useState('generate'); // 'generate' | 'json'
  const [contentInput, setContentInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleGenerate = async () => {
    if (!contentInput.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: contentInput })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setJsonInput(JSON.stringify(data, null, 2));
      setMode('json');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImport = () => {
    try {
      setError(null);
      const parsed = JSON.parse(jsonInput);

      // Helper to ensure all blocks have an ID (dnd-kit requires this)
      const ensureIds = (blocksArray) => {
        return blocksArray.map(b => ({
          ...b,
          id: b.id || Math.random().toString(36).substring(2, 9)
        }));
      };

      if (Array.isArray(parsed)) {
        updatePost({ blocks: ensureIds(parsed) });
      } else if (typeof parsed === 'object' && parsed !== null) {
        if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
          throw new Error('JSON object must contain a "blocks" array.');
        }
        updatePost({
          ...parsed,
          blocks: ensureIds(parsed.blocks)
        });
      } else {
        throw new Error('Input must be a JSON object or array of blocks.');
      }

      onClose();
      // Reset state for next time
      setJsonInput('');
      setContentInput('');
      setMode('generate');
    } catch (err) {
      setError(err.message || 'Invalid JSON format');
    }
  };

  const handleScroll = (e) => {
    if (textareaRef.current) {
      const pre = textareaRef.current.previousElementSibling;
      if (pre) {
        pre.scrollTop = e.target.scrollTop;
        pre.scrollLeft = e.target.scrollLeft;
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="w-full max-w-4xl bg-surface rounded-[24px] shadow-2xl flex flex-col h-[85vh] overflow-hidden relative z-[1000] animate-in zoom-in-95 fade-in duration-300 premium-shadow border border-rule/50">

        {/* Header */}
        <div className="px-8 py-5 flex justify-between items-center shrink-0 bg-surface border-b border-rule/50">
          <div className="flex gap-8 items-center">
            <div className="flex items-center gap-2">
              <Fan className="w-6 h-6" />

              <h2 className="text-xl  font-semibold text-ink">AI Generator</h2>
            </div>

            {/* Segmented Control */}
            <div className="flex bg-surface-sunken p-1 rounded-full border border-rule/30">
              <button
                onClick={() => setMode('generate')}
                className={`flex items-center gap-2 px-5 py-1.5 text-[13px] font-bold rounded-full transition-all duration-200 active:scale-[0.98] ${mode === 'generate' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink hover:bg-surface/50'}`}
              >
                <Type className="w-3.5 h-3.5" />
                Content
              </button>
              <button
                onClick={() => setMode('json')}
                className={`flex items-center gap-2 px-5 py-1.5 text-[13px] font-bold rounded-full transition-all duration-200 active:scale-[0.98] ${mode === 'json' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink hover:bg-surface/50'}`}
              >
                <CodeXml className="w-3.5 h-3.5" />
                JSON
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:bg-surface-sunken hover:text-ink transition-colors active:scale-[0.95]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 flex-1 flex flex-col gap-6 overflow-hidden bg-bg">
          {error && (
            <div className="text-warn-ink text-[13px] font-medium bg-warn-bg px-4 py-3 rounded-xl border border-warn-ink/20 shrink-0 flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          {mode === 'generate' ? (
            <div className="flex flex-col flex-1 gap-3">
              <label className="text-[11px] font-bold text-muted uppercase tracking-widest pl-1">Source Content</label>
              <textarea
                className="w-full flex-1 font-sans text-[15px] p-6 bg-surface border border-rule/60 rounded-2xl outline-none focus:border-forest/50 focus:ring-4 focus:ring-forest/10 resize-none leading-relaxed shadow-sm transition-all text-ink placeholder:text-muted-soft"
                placeholder="Paste your rough draft, bullet points, or markdown here. We'll structure it into beautiful blocks..."
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex flex-col flex-1 gap-3 overflow-hidden relative">
              <label className="text-[11px] font-bold text-muted uppercase tracking-widest pl-1 shrink-0">Generated JSON</label>
              <div className="relative flex-1 rounded-2xl border border-rule/60 bg-surface shadow-sm overflow-hidden focus-within:border-forest/50 focus-within:ring-4 focus-within:ring-forest/10 transition-all">
                <textarea
                  className="w-full h-full p-6 font-mono text-[13px] leading-[1.6] bg-transparent text-ink/80 outline-none resize-none whitespace-pre-wrap break-words"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  spellCheck="false"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-rule/50 flex justify-between items-center shrink-0 bg-surface">
          {isGenerating ? (
            <div className="flex items-center gap-3 text-forest font-bold text-[13px]">
              <Fan className="animate-spin w-4 h-4 text-forest" />
              Generating structure...
            </div>
          ) : (
            <div className="text-[13px] text-muted">
              {mode === 'generate' ? 'Uses gemini-3.8-flash' : 'Feel free to tweak the JSON before painting.'}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-muted font-bold hover:text-ink hover:bg-surface-sunken transition-all active:scale-[0.98] text-[13px]"
            >
              Cancel
            </button>

            {mode === 'generate' ? (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !contentInput.trim()}
                className="px-8 py-2.5 rounded-full bg-forest text-white font-bold hover:bg-ink transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-[13px] flex items-center gap-2"
              >
                <Fan className="w-4 h-4" />
                Generate JSON
              </button>
            ) : (
              <button
                onClick={handleImport}
                className="px-8 py-2.5 rounded-full bg-forest text-white font-bold hover:bg-ink transition-all active:scale-[0.98] shadow-sm text-[13px]"
              >
                Paint to Canvas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
