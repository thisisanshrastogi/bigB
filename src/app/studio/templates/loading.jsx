export default function TemplatesLoading() {
  return (
    <div className="p-8 md:p-12 max-w-[1240px] mx-auto min-h-screen bg-bg">
      <header className="mb-10 flex items-end justify-between animate-pulse">
        <div className="flex flex-col gap-3">
          <div className="h-10 w-64 bg-ink/5 rounded-md" />
          <div className="h-4 w-96 bg-ink/5 rounded-md" />
        </div>
        <div className="h-[44px] w-32 bg-ink/5 rounded-full" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-surface rounded-[22px] p-5 h-[320px] border border-border/50 flex flex-col animate-pulse">
            <div className="bg-ink/5 rounded-xl h-28 p-4" />
            <div className="mt-4 flex-1 flex flex-col gap-2.5">
              <div className="h-5 w-3/4 bg-ink/5 rounded mb-1" />
              <div className="h-4 w-full bg-ink/5 rounded" />
              <div className="h-4 w-5/6 bg-ink/5 rounded" />
              <div className="mt-auto pt-4 flex flex-col gap-4">
                <div className="h-3 w-32 bg-ink/5 rounded" />
                <div className="h-10 w-full bg-ink/5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
