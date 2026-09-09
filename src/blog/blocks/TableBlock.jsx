export default function TableBlock({ data, editing }) {
  const { 
    columns = [], 
    rows = [], 
    firstColSticky = false, 
    caption = '', 
    zebra = false, 
    presentation = 'boxed',
    mobileLayout = 'scroll'
  } = data || {};

  if (!columns.length && !rows.length) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Add table data...
      </div>
    );
  }

  const isMinimal = presentation === 'minimal';
  const isStackedMobile = mobileLayout === 'stacked';

  const containerClass = isMinimal
    ? `w-full ${isStackedMobile ? 'md:overflow-x-auto' : 'overflow-x-auto'} pb-4 my-8`
    : `w-full ${isStackedMobile ? 'md:overflow-x-auto bg-transparent md:bg-white md:border md:border-[#E2DFD5] md:shadow-sm rounded-[16px]' : 'overflow-x-auto border border-[#E2DFD5] rounded-[16px] shadow-sm'} my-8`;

  const tableClass = `w-full text-left font-sans text-[15px] md:text-[16px] border-collapse ${isStackedMobile ? 'block md:table min-w-0 md:min-w-[600px]' : 'min-w-[600px]'}`;

  const thClass = isMinimal
    ? "font-sans text-[11px] font-[700] tracking-[0.1em] uppercase text-[#171613] py-4 px-4 border-b-2 border-t border-[#171613] bg-white whitespace-nowrap"
    : "font-sans text-[11px] font-[700] tracking-[0.1em] uppercase text-[#6B6658] py-4 px-4 border-b border-[#E2DFD5] bg-[#F7F5EF] whitespace-nowrap";

  return (
    <div className="flex flex-col">
      <div className={containerClass}>
        <table className={tableClass}>
          <thead className={isStackedMobile ? 'hidden md:table-header-group' : ''}>
            <tr>
              {columns.map((col, i) => {
                const alignClass = `text-${col.align || 'left'}`;
                const stickyClass = (firstColSticky && i === 0 && !isStackedMobile) ? "sticky left-0 z-10" : "";
                return (
                  <th key={i} className={`${thClass} ${alignClass} ${stickyClass}`} style={{ width: col.width ? `${col.width}px` : 'auto' }}>
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={isStackedMobile ? 'block md:table-row-group gap-4 flex-col flex md:table-row-group' : ''}>
            {rows.map((row, rowIndex) => {
              const rowCells = row.cells || [];
              const zebraClass = (zebra && rowIndex % 2 === 1) ? "bg-[#FBFaf8]" : "bg-white";
              
              const trMobileClass = isStackedMobile 
                ? "block md:table-row border border-[#E2DFD5] md:border-0 md:border-b md:last:border-0 rounded-[12px] md:rounded-none overflow-hidden shadow-sm md:shadow-none"
                : "border-b border-[#E2DFD5] last:border-0";
                
              return (
                <tr key={rowIndex} className={`${trMobileClass} hover:bg-[#F7F5EF]/50 transition-colors ${zebraClass}`}>
                  {columns.map((col, colIndex) => {
                    const cellData = rowCells[colIndex]?.text || '';
                    const alignClass = `text-${col.align || 'left'}`;
                    const stickyClass = (firstColSticky && colIndex === 0 && !isStackedMobile) ? `sticky left-0 z-10 ${zebraClass}` : "";
                    
                    const isNumeric = /^[\d\.\,\$\€\£\%\+\-\s]+$/.test(cellData);
                    const tabularClass = isNumeric ? 'tabular-nums' : '';
                    
                    const tdMobileClass = isStackedMobile
                      ? "flex md:table-cell justify-between items-center md:items-start border-b border-[#E2DFD5] md:border-0 last:border-0"
                      : "";

                    return (
                      <td key={colIndex} className={`py-4 px-4 text-[#2E2B25] ${alignClass} ${stickyClass} ${tabularClass} ${tdMobileClass}`}>
                        {isStackedMobile && (
                          <span className="md:hidden font-bold text-[11px] uppercase tracking-wider text-[#6B6658] mr-4 shrink-0">
                            {col.label}
                          </span>
                        )}
                        <span className={isStackedMobile ? 'text-right md:text-left break-words min-w-0' : ''}>
                          {cellData}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {caption && (
        <div className="font-sans text-[13px] leading-[1.5] text-[#8A8375] -mt-4 mb-8 text-center">
          {caption}
        </div>
      )}
    </div>
  );
}
