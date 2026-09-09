"use client";
import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export default function EmbedBlock({ data, editing }) {
  const { 
    url = '', 
    provider = 'youtube', 
    aspect = '16:9', 
    caption = '', 
    lazy = true, 
    privacyMode = false 
  } = data || {};

  const [isLoaded, setIsLoaded] = useState(!lazy);
  const [thumb, setThumb] = useState(null);

  useEffect(() => {
    if (!url) return;
    if (provider === 'youtube') {
      let videoId = '';
      if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
      else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
      else videoId = url.split('/').pop();
      // hqdefault is more reliably present than maxresdefault
      setThumb(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
    } else if (provider === 'vimeo') {
      const videoId = url.split('/').pop();
      fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].thumbnail_large) {
            setThumb(data[0].thumbnail_large);
          }
        })
        .catch(() => {});
    } else {
      setThumb(null);
    }
  }, [url, provider]);

  if (!url) {
    return (
      <div className="border border-dashed border-border-strong py-16 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Paste an embed URL
      </div>
    );
  }

  const aspectMap = {
    '16:9': 'aspect-video',
    '1:1': 'aspect-square',
    'auto': 'aspect-auto'
  };
  const aspectClass = aspectMap[aspect] || aspectMap['16:9'];

  const getEmbedUrl = () => {
    if (provider === 'youtube') {
      let videoId = '';
      if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
      else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
      else videoId = url.split('/').pop();
      const domain = privacyMode ? 'www.youtube-nocookie.com' : 'www.youtube.com';
      return `https://${domain}/embed/${videoId}?autoplay=${lazy ? 1 : 0}`;
    }
    if (provider === 'vimeo') {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=${lazy ? 1 : 0}`;
    }
    // Very simplified fallback
    return url;
  };

  const handlePlay = () => {
    setIsLoaded(true);
  };

  return (
    <div className="flex flex-col mb-8 mt-2">
      <div className={`w-full rounded-[20px] overflow-hidden relative bg-surface-sunken ${aspectClass}`}>
        {!isLoaded ? (
          <div 
            className="absolute inset-0 bg-border flex items-center justify-center cursor-pointer group bg-cover bg-center"
            style={thumb ? { backgroundImage: `url(${thumb})` } : {}}
            onClick={handlePlay}
          >
            <div className="w-[56px] h-[56px] rounded-full bg-surface shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
              <Play className="w-6 h-6 text-ink ml-1" fill="currentColor" />
            </div>
          </div>
        ) : (
          <iframe 
            src={getEmbedUrl()} 
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={caption || 'Embedded Content'}
          />
        )}
      </div>
      
      {caption && (
        <figcaption className="font-sans text-[13px] leading-[1.5] text-muted mt-[10px] text-center">
          {caption}
        </figcaption>
      )}
    </div>
  );
}
