'use client';

export default function MediaGrid() {
  // Mock media data until Cloudinary is integrated
  const mediaFiles = [
    { id: '1', name: 'hero-image.jpg', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', size: '1.2 MB', date: '2026-09-01' },
    { id: '2', name: 'product-shot.png', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2599&auto=format&fit=crop', size: '2.4 MB', date: '2026-09-02' },
    { id: '3', name: 'office-vibes.jpg', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2569&auto=format&fit=crop', size: '3.1 MB', date: '2026-09-05' },
    { id: '4', name: 'pattern-bg.jpg', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop', size: '840 KB', date: '2026-09-07' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Upload Dropzone Placeholder */}
      <div className="aspect-square rounded-xl border-2 border-dashed border-border bg-surface-sunken flex flex-col items-center justify-center text-muted hover:border-accent hover:text-accent hover:bg-accent/5 transition-colors cursor-pointer group">
        <svg className="w-10 h-10 mb-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
        <span className="font-semibold text-sm">Drop files here</span>
        <span className="text-xs mt-1 opacity-75">or click to browse</span>
      </div>

      {/* Media Cards */}
      {mediaFiles.map(file => (
        <div key={file.id} className="group relative bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-accent/50 transition-all">
          <div className="aspect-square relative bg-surface-sunken overflow-hidden">
            {/* Using img tag with Next config warning bypass for mock data. In real app, we'll use next/image with Cloudinary loader */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={file.url} alt={file.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
            
            {/* Action Overlay */}
            <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button className="p-2 bg-white text-ink rounded-lg hover:bg-accent hover:text-white transition-colors" title="Copy URL">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
              <button className="p-2 bg-white text-warn-ink rounded-lg hover:bg-warn-bg transition-colors" title="Delete">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
          
          <div className="p-3">
            <h4 className="text-sm font-semibold text-ink truncate" title={file.name}>{file.name}</h4>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-muted font-mono">{file.size}</span>
              <span className="text-xs text-muted">{new Date(file.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
