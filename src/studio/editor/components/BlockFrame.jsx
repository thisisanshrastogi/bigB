"use client";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { blockRegistry } from '@/blog/blocks/blockRegistry';
import { Dna, Fan } from 'lucide-react';

import { useEffect, useState } from 'react';

export default function BlockFrame({ id, block, isSelected, onClick, onRemove, onDuplicate, onChangeType, onMoveUp, onMoveDown, onInsertAfter, onUpdate, onConvert }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConvertMenuOpen, setIsConvertMenuOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isImproveMenuOpen, setIsImproveMenuOpen] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [improvePrompt, setImprovePrompt] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleConvert = async (targetType) => {
    setIsConvertMenuOpen(false);
    setIsConverting(true);
    try {
      const res = await fetch('/api/ai/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentBlock: block, targetType })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Conversion failed');
      }
      
      if (onConvert) {
        onConvert(targetType, data);
      }
    } catch (e) {
      console.error(e);
      setToastMsg(e.message || 'Failed to convert block.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleImprove = async () => {
    if (!improvePrompt.trim()) return;
    setIsImproveMenuOpen(false);
    setIsImproving(true);
    try {
      const res = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentBlock: block, prompt: improvePrompt })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Improvement failed');
      }
      
      if (onUpdate) {
        onUpdate(data);
      }
    } catch (e) {
      console.error(e);
      setToastMsg(e.message || 'Failed to improve block.');
    } finally {
      setIsImproving(false);
      setImprovePrompt('');
    }
  };

  // Setup keyboard shortcuts when selected
  useEffect(() => {
    if (!isSelected) return;
    const handleKeyDown = (e) => {
      // ⌘↑ / ⌘↓ to reorder (disabled if locked)
      if ((e.metaKey || e.ctrlKey) && !block.locked) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          onMoveUp();
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          onMoveDown();
          return;
        }
      }
      
      // Backspace on an empty block (disabled if locked)
      if (e.key === 'Backspace' && !block.locked) {
        const isTextInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
        
        if (!isTextInput) {
          e.preventDefault();
          onRemove();
        } else if (block.type === 'text') {
          // If it's a text block and empty, delete it
          const html = block.data?.html || '';
          // Remove empty paragraph tags TipTap adds
          const isEmpty = !html || html === '<p></p>' || html.trim() === '';
          if (isEmpty) {
            e.preventDefault();
            onRemove();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, onRemove, onMoveUp, onMoveDown, block]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({ id, disabled: block.locked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: (isDragging || block.isGhost) ? 0.4 : 1,
    pointerEvents: block.isGhost ? 'none' : undefined,
  };

  const widthClass = block.data?.width === 'full' ? 'layout-full' : (block.data?.width === 'wide' ? 'layout-wide' : (block.data?.width === 'compact' ? 'layout-compact' : 'layout-narrow'));

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      onClick={onClick}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      {/* Inner wrapper for selection/hover transitions — isolated from dnd transform */}
      <div className={`p-2 rounded-xl transition-all duration-200 ${widthClass} ${isSelected ? 'bg-surface premium-shadow ring-1 ring-accent/20' : 'ring-1 ring-transparent hover:ring-border hover:bg-surface/50'} ${isDragging ? 'shadow-2xl' : ''}`}>

      {/* Selection Chrome */}
      {isSelected && (
        <div className="absolute -top-[34px] left-4 flex pointer-events-none z-20 transition-opacity">
          <div className={`flex items-center bg-[#171613] text-[#E2DFD5] rounded-full shadow-lg pointer-events-auto h-[32px] divide-x divide-white/10 premium-shadow transition-all duration-300 ${isConverting || isImproving ? 'animate-pulse ring-2 ring-accent/50 shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]' : ''}`}>
            
            {/* Drag handle */}
            {!block.locked && (
              <button 
                {...attributes} 
                {...listeners}
                className="px-3 h-full hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center cursor-grab active:cursor-grabbing text-[#D6CFBF] active:scale-[0.98] rounded-l-full"
                title="Drag to move"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" /></svg>
              </button>
            )}
            
            {/* Type change or Slot Label */}
            <div className="relative flex items-center h-full">
              {block.locked ? (
                <div className={`px-3 py-1 h-full flex items-center bg-white/5 text-[11px] font-bold text-white uppercase tracking-widest whitespace-nowrap rounded-l-full`}>
                  {block.slotLabel || blockRegistry[block.type]?.label || block.type}
                  {block.required && <span className="text-warn-bg ml-1">*</span>}
                </div>
              ) : (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                    className="appearance-none bg-transparent pl-4 pr-7 py-1 h-full text-[11px] font-bold text-white uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-colors focus:outline-none flex items-center whitespace-nowrap"
                  >
                    {blockRegistry[block.type]?.label || block.type}
                    <svg className="w-3 h-3 text-[#D6CFBF] absolute right-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <>
                      {/* Click outside overlay */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(false); }}
                      />
                      <div className="absolute top-full left-0 mt-2 w-40 max-h-64 bg-[#171613] text-[#E2DFD5] rounded-xl shadow-2xl z-50 border border-white/10 overflow-y-auto flex flex-col p-1 premium-shadow scrollbar-hide">
                        {Object.entries(blockRegistry).map(([key, config]) => (
                          <button
                            key={key}
                            onClick={(e) => {
                              e.stopPropagation();
                              onChangeType(key);
                              setIsDropdownOpen(false);
                            }}
                            className={`text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 shrink-0 ${block.type === key ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white text-[#D6CFBF]'}`}
                          >
                            {config.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Duplicate */}
            {!block.locked && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                className="px-3 h-full hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center text-[#D6CFBF] active:scale-[0.98]"
                title="Duplicate block"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
            )}
            
            {/* Remove */}
            {!block.locked && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                className="px-3 h-full hover:bg-red-500/20 hover:text-red-400 transition-colors flex items-center justify-center text-[#D6CFBF] active:scale-[0.98]"
                title="Remove block"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}

            {/* Convert */}
            <div className="relative flex items-center h-full">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsConvertMenuOpen(!isConvertMenuOpen); setIsImproveMenuOpen(false); }}
                className={`px-3 h-full hover:bg-white/10 transition-colors flex items-center justify-center active:scale-[0.98] ${isConverting ? 'text-accent' : 'text-[#D6CFBF] hover:text-white'}`}
                title="AI Convert"
                disabled={isConverting || isImproving}
              >
                <Dna className="w-4 h-4" />
              </button>

              {isConvertMenuOpen && (
                <>
                  {/* Click outside overlay */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={(e) => { e.stopPropagation(); setIsConvertMenuOpen(false); }}
                  />
                  <div className="absolute top-full right-0 mt-2 w-40 max-h-64 bg-[#171613] text-[#E2DFD5] rounded-xl shadow-2xl z-50 border border-white/10 overflow-y-auto flex flex-col p-1 premium-shadow scrollbar-hide">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Convert to...</div>
                    {Object.entries(blockRegistry).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConvert(key);
                        }}
                        className={`text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 shrink-0 ${block.type === key ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 hover:text-white text-[#D6CFBF]'}`}
                        disabled={block.type === key}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Improve */}
            <div className="relative flex items-center h-full">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsImproveMenuOpen(!isImproveMenuOpen); setIsConvertMenuOpen(false); }}
                className={`px-3 h-full hover:bg-white/10 transition-colors flex items-center justify-center active:scale-[0.98] rounded-r-full ${isImproving ? 'text-accent' : 'text-[#D6CFBF] hover:text-white'}`}
                title="Improve with AI"
                disabled={isConverting || isImproving}
              >
                <Fan className="w-4 h-4" />
              </button>

              {isImproveMenuOpen && (
                <>
                  {/* Click outside overlay */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={(e) => { e.stopPropagation(); setIsImproveMenuOpen(false); }}
                  />
                  <div className="absolute top-full right-0 mt-2 w-64 bg-[#171613] text-[#E2DFD5] rounded-xl shadow-2xl z-50 border border-white/10 overflow-hidden flex flex-col premium-shadow">
                    <div className="px-3 py-2 bg-white/5 border-b border-white/10 text-[10px] font-bold text-white/70 uppercase tracking-wider">
                      Improve Block
                    </div>
                    <div className="p-2">
                      <textarea
                        autoFocus
                        value={improvePrompt}
                        onChange={(e) => setImprovePrompt(e.target.value)}
                        placeholder="e.g. Make it more professional, fix grammar..."
                        className="w-full h-20 bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleImprove();
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImprove();
                        }}
                        disabled={!improvePrompt.trim()}
                        className="mt-2 w-full py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        Improve <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Block Content */}
      <div className={`pointer-events-none`}>
        <div className={isSelected ? "pointer-events-auto" : ""}>
          {(() => {
            const registryEntry = blockRegistry[block.type];
            if (!registryEntry) return <div className="text-warn-ink text-sm">Unknown block type: {typeof block.type === 'string' ? block.type : 'invalid'}</div>;
            const Component = registryEntry.component;
            return (
              <Component 
                data={block.data || {}} 
                editing={isSelected}
                onChange={(newData) => onUpdate(newData)}
                onSplit={(html1, html2) => {
                  onUpdate({ ...block.data, html: html1 });
                  if (onInsertAfter) onInsertAfter('text', { html: html2 });
                }}
                onSlashCommand={() => {
                  // Slash command logic
                }}
              />
            );
          })()}
        </div>
      </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-3 max-w-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium leading-tight">{toastMsg}</p>
            <button onClick={() => setToastMsg(null)} className="opacity-70 hover:opacity-100 ml-auto shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
