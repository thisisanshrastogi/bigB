export default function DividerBlock({ data }) {
  const { variant = 'rule' } = data || {};

  if (variant === 'space') {
    return <div className="h-[48px] w-full" aria-hidden="true" />;
  }

  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center gap-[14px] py-8">
        <div className="w-[4px] h-[4px] rounded-full bg-[#2C4035]" />
        <div className="w-[4px] h-[4px] rounded-full bg-[#2C4035]" />
        <div className="w-[4px] h-[4px] rounded-full bg-[#2C4035]" />
      </div>
    );
  }

  // rule (default)
  return <hr className="w-full border-t border-[#E2DFD5] my-8" />;
}
