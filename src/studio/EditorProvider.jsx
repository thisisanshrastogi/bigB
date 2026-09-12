'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
// import { debounce } from 'lodash'; // Assuming we'd use lodash or write a simple debounce

const EditorContext = createContext(null);

export function EditorProvider({ children, initialPost }) {
  const [post, setPost] = useState(initialPost);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Basic implementation of undo stack
  const historyRef = useRef([initialPost]);
  const historyIndexRef = useRef(0);
  const lastHistoryPushTime = useRef(Date.now());

  const updatePost = useCallback((updater) => {
    setPost((prev) => {
      const next = typeof updater === 'function' ? { ...prev, ...updater(prev) } : { ...prev, ...updater };

      const now = Date.now();
      const TIME_THRESHOLD = 1000; // 1 second

      const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      
      // Coalesce history states if updates happen rapidly
      if (now - lastHistoryPushTime.current < TIME_THRESHOLD && historyIndexRef.current > 0) {
        nextHistory[historyIndexRef.current] = next;
      } else {
        nextHistory.push(next);
        historyIndexRef.current += 1;
      }

      historyRef.current = nextHistory;
      lastHistoryPushTime.current = now;

      setIsDirty(true);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      setPost(historyRef.current[historyIndexRef.current]);
      setIsDirty(true);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      setPost(historyRef.current[historyIndexRef.current]);
      setIsDirty(true);
    }
  }, []);

  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' | 'preview' | 'details'

  const [device, setDevice] = useState('desktop');
  const [viewAs, setViewAs] = useState('Visitor');

  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('amalgamic_preview_zoom');
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed)) setZoomScale(parsed);
    }
  }, []);

  const updateZoom = useCallback((val) => {
    setZoomScale(val);
    localStorage.setItem('amalgamic_preview_zoom', val.toString());
  }, []);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input field (let native undo handle it)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Autosave
  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        const res = await fetch(`/api/studio/posts/${post.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post)
        });
        if (!res.ok) throw new Error('Failed to save');
      } catch (e) {
        console.error('Autosave failed', e);
      } finally {
        setIsDirty(false);
        setIsSaving(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [post, isDirty]);

  return (
    <EditorContext.Provider value={{
      post, updatePost, undo, redo, isDirty, isSaving,
      selectedBlockId, setSelectedBlockId,
      viewMode, setViewMode,
      device, setDevice, viewAs, setViewAs,
      zoomScale, updateZoom
    }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
