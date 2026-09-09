import { Info, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';

export default function CalloutBlock({ data, editing }) {
  const { 
    variant = 'info', 
    figure = '', 
    title = '', 
    body = '', 
    icon = '', 
    presentation = 'boxed' 
  } = data || {};

  if (!title && !body && !figure) {
    return (
      <div className="border border-dashed border-border-strong py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add callout content...
      </div>
    );
  }

  // Presentation: Rule
  if (presentation === 'rule') {
    return (
      <div className="border-y border-border py-8 my-8 flex flex-col md:flex-row gap-6 items-start">
        {variant?.startsWith('stat') && figure && (
          <div className="font-serif text-[40px] md:text-[44px] text-accent leading-none shrink-0 w-[120px]">
            {figure}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-sans font-bold text-[16.5px] text-ink mb-2">{title}</h4>}
          {body && <p className="font-sans text-[14.5px] md:text-[16px] leading-[1.6] text-ink/80 m-0 whitespace-pre-wrap">{body}</p>}
        </div>
      </div>
    );
  }

  // Presentation: Boxed
  let bgClass = 'bg-highlight';
  let textClass = 'text-accent';
  let bodyTextClass = 'text-accent/80';
  let DefaultIcon = Info;

  if (variant === 'warn') {
    bgClass = 'bg-warn-bg';
    textClass = 'text-warn-ink';
    bodyTextClass = 'text-warn-ink/80';
    DefaultIcon = AlertTriangle;
  } else if (variant === 'success') {
    bgClass = 'bg-highlight';
    DefaultIcon = CheckCircle;
  } else if (variant === 'stat') {
    DefaultIcon = BarChart2;
  } else if (variant === 'stat-forest') {
    bgClass = 'bg-accent';
    textClass = 'text-surface';
    bodyTextClass = 'text-surface/80';
    DefaultIcon = BarChart2;
  }

  return (
    <div className={`${bgClass} rounded-[22px] md:rounded-[24px] px-[28px] py-[24px] my-8 flex gap-5 items-start`}>
      {/* Icon or Stat Figure */}
      {variant?.startsWith('stat') ? (
        figure && (
          <div className={`font-serif text-[40px] md:text-[44px] ${textClass} leading-none shrink-0 min-w-[80px]`}>
            {figure}
          </div>
        )
      ) : (
        <div className={`mt-0.5 shrink-0 ${textClass}`}>
          {icon ? (
            <img src={icon} alt="" className="w-6 h-6 object-contain" />
          ) : (
            <DefaultIcon className="w-6 h-6" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {title && <h4 className={`font-sans font-bold text-[16.5px] ${textClass} mb-1.5`}>{title}</h4>}
        {body && <p className={`font-sans text-[14.5px] leading-[1.6] ${bodyTextClass} m-0 whitespace-pre-wrap`}>{body}</p>}
      </div>
    </div>
  );
}
