"use client";

import { useEffect, useRef, useState } from 'react';
import { useEditor } from '@/studio/EditorProvider';

const deviceWidths = {
  desktop: '1280px',
  tablet: '768px',
  mobile: '390px'
};

const deviceHeights = {
  desktop: '780px',
  tablet: '820px',
  mobile: '740px'
};

const getChassisClasses = (device) => {
  if (device === 'mobile') return "bg-white rounded-[40px] border-[14px] border-[#1a1a1a] shadow-2xl overflow-hidden flex flex-col transition-all duration-300 relative mx-auto shrink-0";
  if (device === 'tablet') return "bg-white rounded-[24px] border-[14px] border-[#1a1a1a] shadow-2xl overflow-hidden flex flex-col transition-all duration-300 relative mx-auto shrink-0";
  return "bg-white rounded-[18px] border border-[#DCD6C7] premium-shadow overflow-hidden flex flex-col transition-all duration-300 relative mx-auto shrink-0";
};

export default function PreviewFrame() {
  const { post, device, viewAs, zoomScale } = useEditor();
  const iframeRef = useRef(null);

  useEffect(() => {
    const sendUpdate = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'preview-update',
          post,
          viewAs
        }, '*');
      }
    };

    const handleMessage = (e) => {
      if (e.data?.type === 'preview-ready') {
        sendUpdate();
      }
    };

    window.addEventListener('message', handleMessage);
    sendUpdate(); // Send on dependencies change

    return () => window.removeEventListener('message', handleMessage);
  }, [post, viewAs]);

  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'preview-update',
        post,
        viewAs
      }, '*');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F2EA] w-full relative">
      <div className="flex flex-1 overflow-hidden w-full">
        <div className="flex-1 bg-canvas overflow-auto py-8 md:py-12 px-4 flex justify-center items-start w-full relative">
          <div 
            className={getChassisClasses(device)}
            style={{ 
              width: deviceWidths[device], 
              height: deviceHeights[device], 
              maxWidth: '100%',
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center'
            }}
          >
            {device === 'desktop' && (
              <div className="h-[34px] flex items-center px-4 gap-4 border-b border-rule shrink-0 w-full bg-white">
                <div className="flex gap-1.5">
                  <div className="w-[9px] h-[9px] rounded-full bg-[#E0DACB]"></div>
                  <div className="w-[9px] h-[9px] rounded-full bg-[#E0DACB]"></div>
                  <div className="w-[9px] h-[9px] rounded-full bg-[#E0DACB]"></div>
                </div>
                
                <div className="flex-1 flex justify-center">
                  <div className="bg-[#F5F2EA] text-faint text-[11px] px-8 sm:px-24 py-1 rounded-full flex items-center truncate max-w-[80%]">
                    amalgamic.io/blog/{post.slug || 'untitled'}
                  </div>
                </div>
                <div className="w-12 hidden sm:block"></div>
              </div>
            )}
            
            {device !== 'desktop' && (
              <div className="absolute top-0 inset-x-0 h-[24px] bg-[#1a1a1a] flex justify-center z-10 pointer-events-none rounded-b-[12px] mx-auto" style={{ width: '40%' }}>
                {/* Simulated hardware notch */}
              </div>
            )}

            <div className={`flex-1 relative w-full flex flex-col bg-white overflow-hidden ${device === 'mobile' ? 'pt-[44px]' : device === 'tablet' ? 'pt-[24px]' : ''}`}>
              <iframe
                ref={iframeRef}
                src="/preview-shell"
                className="w-full h-full border-none flex-1"
                onLoad={handleIframeLoad}
                title="Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


