export default function MediaLoading() {
  return (
    <div className="p-10 max-w-[1240px] mx-auto min-h-screen bg-bg relative">
      <header className="mb-8 flex items-center justify-between animate-pulse">
        <div className="flex items-baseline gap-4">
          <div className="h-[40px] w-32 bg-ink/5 rounded-md" />
          <div className="h-4 w-16 bg-ink/5 rounded-md" />
        </div>
        <div className="flex gap-3">
          <div className="h-[44px] w-64 bg-ink/5 rounded-full" />
          <div className="h-[44px] w-24 bg-ink/5 rounded-full" />
        </div>
      </header>

      <div className="border-2 border-dashed border-border-strong bg-[#F7F9F7] rounded-[22px] p-6 mb-8 flex items-center gap-4 h-[92px] animate-pulse">
        <div className="w-10 h-10 rounded-full bg-ink/5 shrink-0" />
        <div className="flex flex-col gap-2">
           <div className="h-4 w-40 bg-ink/5 rounded" />
           <div className="h-3 w-96 bg-ink/5 rounded" />
        </div>
      </div>

      <div className="flex gap-8 items-start animate-pulse">
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square rounded-[22px] bg-ink/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
