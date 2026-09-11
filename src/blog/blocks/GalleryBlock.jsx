"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

export default function GalleryBlock({ data, editing }) {
  const {
    images = [],
    layout = 'grid-2',
    gap = 20,
    captionMode = 'per-item',
    sharedCaption = ''
  } = data || {};

  const carouselRef = useRef(null);

  if (!images || images.length === 0) {
    return (
      <div className="border border-dashed border-border-strong py-16 px-6 rounded-[24px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Drop images to create a gallery
      </div>
    );
  }

  const renderImage = (img, index, isCarousel = false) => (
    <figure key={index} className={`flex flex-col m-0 ${isCarousel ? 'snap-center shrink-0 w-[74%]' : ''}`}>
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-full object-cover rounded-[20px]"
        style={{ filter: 'saturate(0.78) contrast(0.95)' }}
      />
      {captionMode === 'per-item' && img.caption && (
        <figcaption className="font-sans text-[13px] leading-[1.5] text-muted mt-[10px] text-center">
          {img.caption}
        </figcaption>
      )}
    </figure>
  );

  const renderLayout = () => {
    if (layout === 'carousel') {
      const scroll = (direction) => {
        if (carouselRef.current) {
          const scrollAmount = carouselRef.current.clientWidth * 0.74;
          carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
      };

      return (
        <div className="relative group">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            style={{ gap: `${gap}px` }}
          >
            {images.map((img, i) => renderImage(img, i, true))}
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full bg-surface shadow-md flex items-center justify-center text-ink opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-sunken z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full bg-surface shadow-md flex items-center justify-center text-ink opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-sunken z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      );
    }

    let gridClass = 'grid-cols-2';
    if (layout === 'grid-3') gridClass = 'grid-cols-3';
    // For masonry, we'd typically need a masonry layout library or complex CSS.
    // For now, mapping masonry to standard grid or columns. We will use css columns.

    if (layout === 'masonry') {
      return (
        <div className="columns-2 md:columns-3" style={{ columnGap: `${gap}px` }}>
          {images.map((img, i) => (
            <div key={i} style={{ marginBottom: `${gap}px` }} className="break-inside-avoid">
              {renderImage(img, i)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`grid ${gridClass}`} style={{ gap: `${gap}px` }}>
        {images.map((img, i) => renderImage(img, i))}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {renderLayout()}
      {captionMode === 'shared' && sharedCaption && (
        <div className="font-sans text-[13px] leading-[1.5] text-muted mt-[10px] text-center">
          {sharedCaption}
        </div>
      )}
    </div>
  );
}
