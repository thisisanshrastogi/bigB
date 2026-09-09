export default function ColumnsBlock({ data, editing }) {
  const { 
    count = 2, 
    ratio = '1:1', 
    stackOn = 'mobile',
    children = [[], []] 
  } = data || {};

  // For the editor preview when empty
  const isEmpty = children.every(col => !col || col.length === 0);

  if (isEmpty && editing) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Empty columns layout
      </div>
    );
  }

  const stackClass = stackOn === 'tablet' ? 'md:grid-cols-1 lg:grid-cols-none' : 'max-md:grid-cols-1';

  let gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
  
  if (count === 3) {
    gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
  } else if (count === 2) {
    if (ratio === '2:1') {
      gridTemplateColumns = 'minmax(0, 2fr) minmax(0, 1fr)';
    } else if (ratio === '1:2') {
      gridTemplateColumns = 'minmax(0, 1fr) minmax(0, 2fr)';
    }
  }

  // Handle mobile stack where CSS grid-template-columns inline style might override the tailwind classes.
  // We'll use a custom property or just use standard tailwind classes for the ratios if possible, 
  // but since we need arbitrary minmax, we can use a style tag or just apply style only on non-stacked.
  // A cleaner way is using CSS grid standard tailwind if they match, but since ratio is specific:
  
  return (
    <div 
      className={`grid gap-[26px] my-10 ${stackClass}`}
      style={{
        // Only apply the complex grid template on larger screens based on stackOn
        '--desktop-grid': gridTemplateColumns
      }}
    >
      <style>{`
        @media (min-width: ${stackOn === 'tablet' ? '1024px' : '768px'}) {
          .columns-custom-${stackOn} {
            grid-template-columns: var(--desktop-grid) !important;
          }
        }
      `}</style>
      
      {Array.from({ length: count }).map((_, i) => {
        const colContent = children[i] || [];
        return (
          <div key={i} className={`flex flex-col gap-4 columns-custom-${stackOn}`}>
            {/* If there are real React nodes passed, they render here. Otherwise a placeholder. */}
            {colContent.length > 0 ? colContent : (
              editing && <div className="border border-dashed border-[#E2DFD5] bg-[#F7F5EF] p-4 rounded-[12px] text-center text-muted text-[13px] h-full min-h-[100px] flex items-center justify-center">Column {i+1}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
