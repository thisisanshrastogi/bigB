export default function ImageBlock({ data, editing }) {
  const { 
    src = '', 
    alt = '', 
    caption = '', 
    width = 'narrow', 
    ratio = 'auto', 
    objectFit = 'cover',
    wash = false, 
    link = '', 
    focalPoint = { x: 0.5, y: 0.5 } 
  } = data || {};

  if (!src) {
    return (
      <div className="border border-dashed border-border-strong py-16 px-6 rounded-[24px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Drop an image, or paste a URL
      </div>
    );
  }

  const radiusClass = width === 'full' ? 'rounded-none' : 'rounded-[24px]';
  const washStyle = wash ? { filter: 'saturate(0.78) contrast(0.95)' } : {};
  
  const aspectMap = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    'auto': 'aspect-auto'
  };
  const aspectClass = aspectMap[ratio] || aspectMap.auto;

  const widthClass = width === 'full' ? 'layout-full' : (width === 'wide' ? 'layout-wide' : (width === 'compact' ? 'layout-compact' : 'layout-narrow'));

  const content = (
    <div className={`flex flex-col ${widthClass}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`w-full ${objectFit === 'contain' ? 'object-contain bg-surface-sunken' : 'object-cover'} ${radiusClass} ${aspectClass}`}
        style={{ 
          objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
          ...washStyle 
        }}
      />
      {caption && (
        <figcaption className="font-sans text-[13px] leading-[1.5] text-muted mt-[10px] text-center">
          {caption}
        </figcaption>
      )}
    </div>
  );

  if (link && !editing) {
    return <a href={link} target="_blank" rel="noopener noreferrer" className={widthClass}>{content}</a>;
  }

  return content;
}
