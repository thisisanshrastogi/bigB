// Mock card catalogue data for rendering
const MOCK_CARDS = {
  'card-1': {
    name: 'Amalgamic Reserve',
    artUrl: 'https://placehold.co/400x250/2C4035/FFFFFF?text=Reserve',
    annualFee: '$550',
    creditTotal: '$300',
    affiliateLink: '#',
    defaultVerdict: 'Best for frequent flyers who want premium lounge access.'
  },
  'card-2': {
    name: 'Amalgamic Preferred',
    artUrl: 'https://placehold.co/400x250/C2E0D1/2C4035?text=Preferred',
    annualFee: '$95',
    creditTotal: '$50',
    affiliateLink: '#',
    defaultVerdict: 'Great entry-level travel card.'
  }
};

export default function CardBlock({ data, editing }) {
  const { 
    cardId = '', 
    variant = 'inline', 
    showCTA = true, 
    overrideVerdict = '' 
  } = data || {};

  if (!cardId) {
    return (
      <div className="border border-dashed border-[#D6CFBF] py-8 px-6 rounded-[20px] flex flex-col items-center justify-center text-muted font-sans text-[14px]">
        Select a card from the catalogue...
      </div>
    );
  }

  // Simulate fetching card data
  const cardData = MOCK_CARDS[cardId] || {
    name: 'Unknown Card',
    artUrl: 'https://placehold.co/400x250/E2DFD5/8A8375?text=?',
    annualFee: '?',
    creditTotal: '?',
    affiliateLink: '#',
    defaultVerdict: ''
  };

  const verdict = overrideVerdict || cardData.defaultVerdict;

  if (variant === 'compare-row') {
    // This is meant to be rendered inside a Table block logically, 
    // but React needs valid DOM if it's rendered standalone in the editor.
    // For the editor, we'll wrap it in a table just so it doesn't break, 
    // but in production it might rely on being placed correctly.
    const TrContent = (
      <>
        <td className="py-4 px-4 text-[#2E2B25] font-sans font-bold">
          <div className="flex items-center gap-3">
            <img src={cardData.artUrl} alt="" className="w-16 h-10 object-cover rounded shadow-sm" />
            {cardData.name}
          </div>
        </td>
        <td className="py-4 px-4 text-[#2E2B25] tabular-nums">{cardData.annualFee}</td>
        <td className="py-4 px-4 text-[#2E2B25] tabular-nums">{cardData.creditTotal}</td>
        {showCTA && (
          <td className="py-4 px-4 text-right">
            <a href={cardData.affiliateLink} className="text-[#2C4035] font-bold text-[14px] hover:underline" onClick={e => editing && e.preventDefault()}>Apply</a>
          </td>
        )}
      </>
    );

    return editing ? (
      <div className="w-full overflow-x-auto border border-[#E2DFD5] rounded-[16px] my-8 shadow-sm">
        <table className="w-full text-left font-sans text-[15px] border-collapse min-w-[600px]">
          <tbody><tr className="border-b border-[#E2DFD5] bg-white">{TrContent}</tr></tbody>
        </table>
        <div className="text-[11px] text-muted text-center mt-2">(Compare row preview)</div>
      </div>
    ) : (
      <tr className="border-b border-[#E2DFD5] bg-white hover:bg-[#F7F5EF]/50 transition-colors">
        {TrContent}
      </tr>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-white border border-[#E2DFD5] rounded-[24px] p-6 flex flex-col items-center text-center shadow-sm my-6">
        <h4 className="font-sans font-bold text-[16px] text-ink mb-4">{cardData.name}</h4>
        <img src={cardData.artUrl} alt={cardData.name} className="w-full aspect-[1.6] object-cover rounded-[12px] shadow-sm mb-5" />
        <div className="flex w-full justify-between font-sans text-[14px] border-b border-[#E2DFD5] pb-2 mb-2">
          <span className="text-muted">Annual Fee</span>
          <span className="font-bold tabular-nums text-ink">{cardData.annualFee}</span>
        </div>
        <div className="flex w-full justify-between font-sans text-[14px] mb-5">
          <span className="text-muted">Credit Value</span>
          <span className="font-bold tabular-nums text-mint-ink text-[#2C4035]">{cardData.creditTotal}</span>
        </div>
        {verdict && <p className="font-sans text-[14px] leading-[1.5] text-[#4F5C52] mb-5">{verdict}</p>}
        {showCTA && (
          <a 
            href={cardData.affiliateLink} 
            className="w-full inline-flex items-center justify-center font-sans font-bold text-[15px] px-6 py-3 rounded-full transition-colors bg-[#2C4035] text-white hover:bg-[#1E2D25]"
            onClick={e => editing && e.preventDefault()}
          >
            Learn More
          </a>
        )}
      </div>
    );
  }

  // Inline (default)
  return (
    <div className="bg-white border border-[#E2DFD5] rounded-[24px] p-6 my-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
      <img src={cardData.artUrl} alt={cardData.name} className="w-[180px] md:w-[220px] aspect-[1.6] object-cover rounded-[12px] shadow-sm shrink-0" />
      <div className="flex-1 flex flex-col">
        <h3 className="font-serif text-[24px] leading-[1.3] text-ink m-0 mb-2">{cardData.name}</h3>
        <div className="flex flex-wrap gap-4 font-sans text-[14px] mb-4">
          <div className="bg-[#F7F5EF] px-3 py-1 rounded-full"><span className="text-muted mr-1">Fee:</span> <span className="font-bold tabular-nums">{cardData.annualFee}</span></div>
          <div className="bg-[#C2E0D1]/30 px-3 py-1 rounded-full"><span className="text-muted mr-1">Credits:</span> <span className="font-bold text-[#2C4035] tabular-nums">{cardData.creditTotal}</span></div>
        </div>
        {verdict && <p className="font-sans text-[15px] leading-[1.6] text-[#4F5C52] m-0 mb-5">{verdict}</p>}
        {showCTA && (
          <div className="mt-auto">
             <a 
              href={cardData.affiliateLink} 
              className="inline-flex items-center justify-center font-sans font-bold text-[15px] px-6 py-3 rounded-full transition-colors bg-[#171613] text-[#F5F2EA] hover:bg-white hover:text-[#171613] hover:ring-1 hover:ring-[#171613]"
              onClick={e => editing && e.preventDefault()}
            >
              Apply Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
