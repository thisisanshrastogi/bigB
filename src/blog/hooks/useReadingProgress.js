"use client";
import { useState, useEffect } from 'react';

export function useReadingProgress(totalReadingTime = 0) {
  const [progressPercent, setProgressPercent] = useState(0);
  const [minLeft, setMinLeft] = useState(totalReadingTime);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const article = document.querySelector('article');
      if (!article) {
        setProgressPercent(0);
        setMinLeft(totalReadingTime);
        ticking = false;
        return;
      }

      const rect = article.getBoundingClientRect();
      // rect.top is the distance from top of viewport to top of article
      // rect.bottom is the distance from top of viewport to bottom of article
      // We want progress based on how much of the article has scrolled past the viewport top
      
      const articleHeight = rect.height;
      const articleTop = rect.top + window.scrollY; // Absolute top position
      const articleBottom = articleTop + articleHeight;
      
      // Calculate how far we've scrolled into the article
      // We start at 0 when the top of the article hits the top of the viewport
      const currentScroll = window.scrollY;
      
      let rawProgress = 0;
      
      if (currentScroll < articleTop) {
        rawProgress = 0;
      } else if (currentScroll > articleBottom - window.innerHeight) {
        rawProgress = 1;
      } else {
        const scrollableDistance = articleHeight - window.innerHeight;
        rawProgress = scrollableDistance > 0 ? (currentScroll - articleTop) / scrollableDistance : 1;
      }

      rawProgress = Math.max(0, Math.min(1, rawProgress));
      
      setProgressPercent(Math.round(rawProgress * 100));
      
      if (totalReadingTime) {
        setMinLeft(Math.max(0, Math.ceil(totalReadingTime * (1 - rawProgress))));
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [totalReadingTime]);

  return { progressPercent, minLeft };
}
