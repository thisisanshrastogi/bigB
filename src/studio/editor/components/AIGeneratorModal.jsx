import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEditor } from '@/studio/EditorProvider';

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
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden relative z-[1000]">
        
        {/* Header */}
        <div className="p-6 border-b border-rule flex justify-between items-center shrink-0 bg-[#F5F2EA]">
          <div className="flex gap-4 items-center">
            <h2 className="text-xl font-serif font-bold text-ink">AI Generator</h2>
            <div className="flex bg-[#E0DACB] p-1 rounded-full">
              <button 
                onClick={() => setMode('generate')}
                className={`px-4 py-1.5 text-[13px] font-bold rounded-full transition-colors ${mode === 'generate' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                1. Write Content
              </button>
              <button 
                onClick={() => setMode('json')}
                className={`px-4 py-1.5 text-[13px] font-bold rounded-full transition-colors ${mode === 'json' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                2. Edit JSON
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 flex-1 flex flex-col gap-4 overflow-hidden">
          {error && (
            <div className="text-red-600 text-[13px] font-medium bg-red-50 p-3 rounded-lg border border-red-100 shrink-0">
              {error}
            </div>
          )}

          {mode === 'generate' ? (
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-[13px] font-bold text-ink uppercase tracking-wider">Source Content</label>
              <textarea
                className="w-full flex-1 font-sans text-[15px] p-5 bg-[#F9F8F6] border border-rule rounded-xl outline-none focus:border-forest focus:ring-1 focus:ring-forest resize-none leading-relaxed"
                placeholder="Paste your rough draft, bullet points, or markdown here. We'll turn it into beautiful blocks..."
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex flex-col flex-1 gap-2 overflow-hidden relative">
              <label className="text-[13px] font-bold text-ink uppercase tracking-wider shrink-0">Generated JSON</label>
              
              <div className="relative flex-1 rounded-xl border border-rule bg-[#F9F8F6] overflow-hidden">
                <textarea
                  className="w-full h-full p-5 font-mono text-[13px] leading-[1.6] bg-transparent text-[#2c4035] outline-none resize-none whitespace-pre-wrap break-words"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  spellCheck="false"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-rule flex justify-between items-center shrink-0 bg-[#F5F2EA]">
          {isGenerating ? (
            <div className="flex items-center gap-3 text-forest font-bold text-[14px]">
              <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating blocks...
            </div>
          ) : (
            <div className="text-[13px] text-muted">
              {mode === 'generate' ? 'Uses gemini-3.6-flash' : 'Feel free to tweak the JSON before painting.'}
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-ink font-semibold hover:bg-[#E0DACB] transition-colors"
            >
              Cancel
            </button>
            
            {mode === 'generate' ? (
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !contentInput.trim()}
                className="px-6 py-2.5 rounded-full bg-forest text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Generate JSON
              </button>
            ) : (
              <button 
                onClick={handleImport}
                className="px-6 py-2.5 rounded-full bg-forest text-white font-bold hover:opacity-90 transition-opacity shadow-sm"
              >
                Paint Editor
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
