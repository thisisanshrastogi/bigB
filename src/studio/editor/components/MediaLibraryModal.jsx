import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function MediaLibraryModal({ isOpen, onClose, onSelect }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'library'
  const [images, setImages] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [customName, setCustomName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('upload');
      setCustomName('');
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setIsUploading(false);
    }
  }, [isOpen, previewUrl]);

  const fetchLibrary = async (token = null) => {
    if (token) setIsLoadingMore(true);
    else setIsLoadingLibrary(true);
    setError(null);
    try {
      const url = token ? `/api/studio/media?token=${encodeURIComponent(token)}` : '/api/studio/media';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch media library');
      const data = await res.json();
      
      if (token) {
        setImages(prev => [...prev, ...data.images]);
      } else {
        setImages(data.images);
      }
      setNextToken(data.nextContinuationToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingLibrary(false);
      setIsLoadingMore(false);
    }
  };

  // Fetch library when tab changes to library
  useEffect(() => {
    if (isOpen && activeTab === 'library') {
      fetchLibrary();
    }
  }, [isOpen, activeTab]);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (!customName) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
      setCustomName(nameWithoutExt || file.name);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (customName) formData.append('customName', customName);

    try {
      const res = await fetch('/api/studio/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onSelect(data.image.url);
      onClose();
    } catch (err) {
      setError(err.message);
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCustomName('');
    setError(null);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col h-[75vh] overflow-hidden relative z-[1001]">

        {/* Header */}
        <div className="p-6 border-b border-rule flex justify-between items-center shrink-0 bg-[#F5F2EA]">
          <div className="flex gap-4 items-center">
            <h2 className="text-xl font-serif font-semibold text-ink">Media Library</h2>
            <div className="flex bg-[#E0DACB] p-1 rounded-full ml-4">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-1.5 text-[13px] font-bold rounded-full transition-colors ${activeTab === 'upload' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                Upload
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`px-4 py-1.5 text-[13px] font-bold rounded-full transition-colors ${activeTab === 'library' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                Library
              </button>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#F9F8F6]">
          {error && (
            <div className="mb-4 text-red-600 text-[13px] font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {activeTab === 'upload' ? (
            <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto w-full">
              {selectedFile ? (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full rounded-xl overflow-hidden border border-rule mb-6 shadow-sm bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-[300px] object-contain" />
                  </div>
                  
                  <div className="w-full mb-6">
                    <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-2">Image Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. hero-image" 
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-rule focus:border-forest outline-none bg-white text-[14px]"
                      disabled={isUploading}
                    />
                  </div>
                  
                  <div className="w-full flex gap-3">
                    <button 
                      onClick={cancelUpload}
                      disabled={isUploading}
                      className="flex-1 px-4 py-3 rounded-xl font-bold text-[14px] border border-rule text-ink hover:bg-white transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUploadSubmit}
                      disabled={isUploading || !customName.trim()}
                      className="flex-[2] px-4 py-3 rounded-xl font-bold text-[14px] bg-forest text-white hover:bg-forest/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        'Save & Select'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full flex-1 min-h-[200px] border-2 border-dashed border-[#D6CFBF] rounded-xl bg-white p-8 text-center transition-colors hover:border-forest group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                  <div className="w-16 h-16 bg-[#F2EFE8] rounded-full flex items-center justify-center mb-4 text-muted group-hover:text-forest transition-colors">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">
                    Click or Drag to Upload
                  </h3>
                  <p className="text-[13px] text-muted">Supports JPG, PNG, GIF, WebP up to 5MB</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {isLoadingLibrary ? (
                <div className="flex justify-center items-center py-20 text-muted">
                  Loading library...
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-20 text-muted">
                  No images found in your bucket.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img) => (
                      <div
                        key={img.key}
                        className="aspect-square bg-white border border-rule rounded-lg overflow-hidden cursor-pointer hover:border-forest group relative shadow-sm"
                        onClick={() => {
                          onSelect(img.url);
                          onClose();
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.key}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-forest text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Select</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {nextToken && (
                    <div className="mt-8 flex justify-center pb-4">
                      <button 
                        onClick={() => fetchLibrary(nextToken)}
                        disabled={isLoadingMore}
                        className="px-6 py-2 bg-white border border-rule text-ink font-bold text-[13px] rounded-full hover:border-forest transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isLoadingMore ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
