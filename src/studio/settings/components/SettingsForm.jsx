'use client';

export default function SettingsForm() {
  return (
    <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
      {/* Site Configuration */}
      <section>
        <h2 className="text-xl font-serif text-brand font-semibold mb-6">Site Configuration</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Site Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-surface"
              defaultValue="Amalgamic Blog"
            />
            <p className="text-xs text-muted mt-1.5">Used in the browser tab and global meta tags.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Site Description</label>
            <textarea 
              className="w-full px-4 py-2 rounded-lg border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-surface resize-none h-24"
              defaultValue="Insights and tutorials from the Amalgamic team."
            />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* SEO Defaults */}
      <section>
        <h2 className="text-xl font-serif text-brand font-semibold mb-6">SEO Defaults</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Default OpenGraph Image</label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 bg-surface-sunken border border-border rounded-lg flex items-center justify-center text-muted text-xs">
                No image
              </div>
              <button type="button" className="px-4 py-2 bg-surface text-ink text-sm font-medium border border-border rounded-lg hover:border-border-strong hover:bg-white transition-colors">
                Choose Image
              </button>
            </div>
            <p className="text-xs text-muted mt-2">Fallback image when a post doesn&apos;t have a specific OG image.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Twitter Handle</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">@</span>
              <input 
                type="text" 
                className="w-full pl-8 pr-4 py-2 rounded-lg border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all bg-surface"
                defaultValue="amalgamic"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="pt-6 flex justify-end">
        <button type="submit" className="bg-ink text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md hover:bg-opacity-90 transition-all">
          Save Settings
        </button>
      </div>
    </form>
  );
}
