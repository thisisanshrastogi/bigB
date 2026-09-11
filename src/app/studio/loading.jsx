export default function StudioLoading() {
  return (
    <div className="w-full max-w-[1240px] mx-auto min-h-screen bg-paper py-12 px-[clamp(20px,5vw,76px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 animate-pulse">
        <div className="h-[40px] w-32 bg-ink/5 rounded-md" />
        <div className="flex gap-4">
          <div className="h-10 w-64 bg-ink/5 rounded-[14px]" />
          <div className="h-10 w-32 bg-ink/5 rounded-full" />
        </div>
      </div>

      {/* StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl p-6 border border-border/50 h-32 animate-pulse">
            <div className="h-4 w-20 bg-ink/5 rounded mb-4" />
            <div className="h-8 w-12 bg-ink/10 rounded" />
          </div>
        ))}
      </div>

      {/* FilterChips */}
      <div className="mb-6 flex gap-2 animate-pulse">
        {[...Array(4)].map((_, i) => (
           <div key={i} className="h-8 w-24 bg-ink/5 rounded-full" />
        ))}
      </div>

      {/* PostsTable */}
      <div className="bg-surface rounded-[22px] shadow-sm border border-border/50 pb-4 p-6 animate-pulse">
        <div className="flex flex-col gap-4">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="h-12 w-full bg-ink/5 rounded-lg" />
           ))}
        </div>
      </div>
    </div>
  );
}
