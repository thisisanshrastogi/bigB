"use client";
import { useState, useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ data }) {
  const { 
    language = 'javascript', 
    code = '', 
    filename = '', 
    showLineNumbers = false, 
    highlightLines = [] 
  } = data || {};

  const [copied, setCopied] = useState(false);

  if (!code) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add code snippet...
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="my-8 rounded-[20px] overflow-hidden bg-[#171613] flex flex-col relative group">
      {filename && (
        <div className="px-5 py-3 border-b border-white/10 text-[#B9B2A2] font-mono text-[12px] flex items-center justify-between">
          <span>{filename}</span>
          <span className="uppercase text-[10px] tracking-wider opacity-50">{language}</span>
        </div>
      )}

      {!filename && (
        <div className="absolute top-3 right-[52px] text-[#B9B2A2] font-mono text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-50 transition-opacity z-10 pointer-events-none">
          {language}
        </div>
      )}

      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors z-10 opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>

      <div className="p-5 overflow-x-auto text-[13.5px] leading-[1.7] font-mono">
        <pre className="m-0">
          <code className="block w-full">
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const isHighlighted = highlightLines.includes(lineNum);
              return (
                <div 
                  key={i} 
                  className={`flex ${isHighlighted ? 'bg-white/10 -mx-5 px-5' : ''}`}
                >
                  {showLineNumbers && (
                    <span className="shrink-0 w-8 text-right pr-4 text-white/30 select-none">
                      {lineNum}
                    </span>
                  )}
                  <span className="text-[#F5F2EA]">{line || ' '}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
