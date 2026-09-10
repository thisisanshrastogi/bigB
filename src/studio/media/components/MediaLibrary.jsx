"use client";

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Loader from '@/components/Loader';

export default function MediaLibrary() {
  const [images, setImages] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedFileForUpload, setSelectedFileForUpload] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [customName, setCustomName] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [renameDialog, setRenameDialog] = useState({ isOpen: false, key: null, name: '' });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, key: null });
  const [previewDialog, setPreviewDialog] = useState({ isOpen: false, url: '', name: '' });

  const fileInputRef = useRef(null);

  const fetchLibrary = async (token = null, search = '') => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (token) query.append('token', token);
      if (search) query.append('search', search);

      const url = `/api/studio/media?${query.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (token) {
        setImages(prev => {
          const newImages = [...prev, ...data.images];
          if (!selectedKey && newImages.length > 0) setSelectedKey(newImages[0].key);
          return newImages;
        });
      } else {
        setImages(data.images);
        if (!selectedKey && data.images.length > 0) setSelectedKey(data.images[0].key);
      }
      setNextToken(data.nextContinuationToken);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLibrary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFileForUpload(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (!customName) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
      setCustomName(nameWithoutExt || file.name);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFileForUpload) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFileForUpload);
    if (customName) formData.append('customName', customName);
    try {
      const res = await fetch('/api/studio/media', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error('Upload failed');
      cancelUpload();
      fetchLibrary(null, searchQuery);
      setSelectedKey(data.image.public_id || data.image.url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFileForUpload(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCustomName('');
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setImages([]);
    setSelectedKey(null);
    setNextToken(null);
    fetchLibrary(null, searchInput);
  };

  const handleRename = async () => {
    if (!renameDialog.name.trim()) return;
    try {
      const res = await fetch('/api/studio/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: renameDialog.key, newName: renameDialog.name })
      });
      if (res.ok) {
        setRenameDialog({ isOpen: false, key: null, name: '' });
        fetchLibrary(null, searchQuery);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/studio/media?key=${encodeURIComponent(deleteDialog.key)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDeleteDialog({ isOpen: false, key: null });
        if (selectedKey === deleteDialog.key) setSelectedKey(null);
        fetchLibrary(null, searchQuery);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = (url, filename) => {
    const proxyUrl = `/api/studio/media/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    window.open(proxyUrl, '_blank');
  };

  const selectedFile = images.find(f => f.key === selectedKey) || images[0];

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const kb = bytes / 1024;
    if (kb > 1024) return (kb / 1024).toFixed(1) + ' MB';
    return Math.round(kb) + ' KB';
  };

  const getName = (key) => {
    if (!key) return '';
    const name = key.split('/').pop();

    // Strip trailing timestamp: name-1234567890123.ext
    const endMatch = name.match(/^(.*?)-(\d{13})(\.[^.]+)?$/);
    if (endMatch) return endMatch[1] + (endMatch[3] || '');

    // Strip prefix timestamp: 1234567890123-name.ext
    const startMatch = name.match(/^(\d{13})-(.*)$/);
    if (startMatch) return startMatch[2];

    return name;
  };
  const getExt = (key) => key ? key.split('.').pop().toUpperCase() : '';

  return (
    <div className="p-10 max-w-[1240px] mx-auto min-h-screen bg-bg relative">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files[0])}
      />

      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-baseline gap-4">
          <h1 className="text-[34px] font-serif text-ink tracking-tight">Media</h1>
          <span className="text-[14px] text-muted-soft">{images.length} images</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search images..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-surface border border-border-strong rounded-full pl-4 pr-10 py-2.5 text-[14px] text-ink focus:outline-none focus:border-accent w-64"
            />
            <button onClick={handleSearch} className="absolute right-3 text-muted-soft hover:text-ink">
              <Search className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-ink text-surface px-6 py-2.5 rounded-full text-[14px] font-semibold hover:bg-ink/90 transition-colors disabled:opacity-50">
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </header>

      {/* DropZone / Upload Preview */}
      {selectedFileForUpload ? (
        <div className="border border-border-strong bg-white rounded-[22px] p-6 mb-8 flex gap-6 shadow-sm">
          <div className="w-48 h-32 rounded-xl overflow-hidden bg-[#F7F9F7] flex items-center justify-center border border-border/50 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <label className="text-[12px] font-bold text-ink mb-2">Image Name</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full max-w-sm bg-surface border border-border-strong rounded-lg p-2.5 text-[13px] text-ink focus:outline-none focus:border-accent"
              disabled={isUploading}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUploadSubmit}
                disabled={isUploading || !customName.trim()}
                className="bg-ink text-surface px-5 py-2 rounded-full text-[13px] font-semibold hover:bg-ink/90 transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Save & Upload'}
              </button>
              <button
                onClick={cancelUpload}
                disabled={isUploading}
                className="px-5 py-2 rounded-full border border-border-strong text-[13px] font-semibold text-ink hover:bg-surface-sunken transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border-strong bg-[#F7F9F7] rounded-[22px] p-6 mb-8 flex items-center gap-4 cursor-pointer hover:bg-[#F3F7F3] transition-colors">
          <div className="w-10 h-10 rounded-full bg-accent-tint flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-ink mb-0.5">Drop images anywhere</h3>
            <p className="text-[13px] text-muted-soft">JPG, PNG or WebP up to 8 MB. Resized and served in three widths automatically.</p>
          </div>
        </div>
      )}

      <div className="flex gap-8 items-start">
        {/* Media Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 content-start">
            {isLoading && images.length === 0 ? (
              <div className="col-span-full py-20 flex justify-center">
                <Loader size="md" text="Loading media..." />
              </div>
            ) : images.length === 0 ? (
              <div className="col-span-full py-10 text-center text-muted-soft">No images found.</div>
            ) : images.map((file) => {
              const isSelected = selectedKey === file.key;
              const name = getName(file.key);
              return (
                <div
                  key={file.key}
                  onClick={() => setSelectedKey(file.key)}
                  className={`aspect-square rounded-[22px] overflow-hidden cursor-pointer transition-all duration-200 relative group
                    ${isSelected ? 'border-[2.5px] border-accent shadow-sm scale-[1.02] ring-2 ring-white' : 'border border-border/50 hover:border-border-strong bg-surface-sunken'}
                  `}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={file.url} alt={name} className="w-full h-full object-cover saturate-[0.78] contrast-[0.95]" loading="lazy" />

                  {!isSelected && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] font-bold text-white tracking-wider truncate block">{name}</span>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewDialog({ isOpen: true, url: file.url, name: getName(file.key) }) }}
                        className="p-2 bg-white/90 rounded-full hover:bg-white text-ink shadow-sm transition-colors"
                        title="Preview"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(file.url, getName(file.key)) }}
                        className="p-2 bg-white/90 rounded-full hover:bg-white text-ink shadow-sm transition-colors"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setRenameDialog({ isOpen: true, key: file.key, name: getName(file.key) }) }}
                        className="p-2 bg-white/90 rounded-full hover:bg-white text-ink shadow-sm transition-colors"
                        title="Rename"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteDialog({ isOpen: true, key: file.key }) }}
                        className="p-2 bg-white/90 rounded-full hover:bg-white text-warn-ink shadow-sm transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {nextToken && (
            <div className="mt-8 flex justify-center pb-8">
              <button
                onClick={() => fetchLibrary(nextToken, searchQuery)}
                className="px-6 py-2.5 rounded-full border border-border-strong text-[14px] font-semibold text-ink hover:bg-surface-sunken transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>


      </div>

      {/* Modals */}
      {renameDialog.isOpen && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-[18px] font-bold text-ink mb-4">Rename Image</h3>
            <input
              type="text"
              value={renameDialog.name}
              onChange={(e) => setRenameDialog(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-bg border border-border-strong rounded-xl p-3 text-[14px] text-ink focus:outline-none focus:border-accent mb-6"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRenameDialog({ isOpen: false, key: null, name: '' })} className="px-5 py-2 rounded-full border border-border-strong text-[13px] font-semibold text-ink hover:bg-surface-sunken">Cancel</button>
              <button onClick={handleRename} className="bg-ink text-surface px-5 py-2 rounded-full text-[13px] font-semibold hover:bg-ink/90">Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteDialog.isOpen && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-[18px] font-bold text-ink mb-2">Delete Image</h3>
            <p className="text-[14px] text-muted-soft mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteDialog({ isOpen: false, key: null })} className="px-5 py-2 rounded-full border border-border-strong text-[13px] font-semibold text-ink hover:bg-surface-sunken">Cancel</button>
              <button onClick={handleDelete} className="bg-warn-ink text-surface px-5 py-2 rounded-full text-[13px] font-semibold hover:bg-warn-ink/90">Delete</button>
            </div>
          </div>
        </div>
      )}

      {previewDialog.isOpen && (
        <div 
          className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
          onClick={() => setPreviewDialog({ isOpen: false, url: '', name: '' })}
        >
          <div className="absolute top-6 right-6">
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={previewDialog.url} 
            alt={previewDialog.name} 
            className="max-w-[95vw] max-h-[90vh] object-contain cursor-default rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
