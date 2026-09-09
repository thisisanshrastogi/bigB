import RichTextEditor from '@/studio/editor/components/RichTextEditor';

export default function TextBlock({ data, editing, onChange, onSplit, onSlashCommand }) {
  const { html = '', dropcap = false, size = 'regular' } = data || {};

  const sizeMap = {
    regular: 'text-[19px] leading-[1.8] text-[#2E2B25]',
    lead: 'text-[21.5px] leading-[1.58] text-[#4A463D]',
  };

  const dropCapClass = dropcap
    ? 'first-letter:font-serif first-letter:text-[64px] first-letter:font-bold first-letter:text-ink first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8] first-letter:mt-1.5'
    : '';

  if (editing) {
    return (
      <div className={`font-sans ${dropCapClass}`}>
        <RichTextEditor
          value={html}
          onChange={(newHtml) => onChange?.({ ...data, html: newHtml })}
          onSplit={onSplit}
          onSlashCommand={onSlashCommand}
          sizeClass={sizeMap[size] || sizeMap.regular}
        />
      </div>
    );
  }

  if (!html || html === '<p></p>') {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Type some text...
      </div>
    );
  }

  return (
    <div
      className={`font-sans ${sizeMap[size] || sizeMap.regular} mb-0 prose prose-p:my-0 prose-a:text-[#2E2B25] prose-a:border-b-[1.5px] prose-a:border-[#8DC4AC] hover:prose-a:border-solid hover:prose-a:border-[#8DC4AC] hover:prose-a:bg-[#8DC4AC]/10 prose-a:no-underline prose-strong:font-bold prose-code:text-[13px] prose-code:bg-[#F1EEE6] prose-code:px-[5px] prose-code:py-[2px] prose-code:rounded-[5px] max-w-none [text-wrap:pretty] ${dropCapClass}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
