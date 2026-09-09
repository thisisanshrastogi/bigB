'use client';

import { useState } from 'react';
import StatCard from './StatCard';
import FilterChips from './FilterChips';
import PostsTable from './PostsTable';
import NewPostDialog from '@/studio/components/NewPostDialog';

export default function DashboardClient({ initialPosts = [] }) {
  const [filter, setFilter] = useState('All'); // All, Published, Draft, Scheduled
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);

  // Calculate stats
  const total = initialPosts.length;
  const published = initialPosts.filter(p => p.status === 'published').length;
  const drafts = initialPosts.filter(p => p.status === 'draft').length;
  const scheduled = initialPosts.filter(p => p.status === 'scheduled').length;

  const totalViews = initialPosts.reduce((sum, p) => sum + (p.views || 0), 0);
  const formatViews = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toLocaleString();
  };

  // Filter posts
  const filteredPosts = initialPosts.filter(p => {
    if (filter === 'All') return true;
    return p.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="w-full max-w-[1240px] mx-auto min-h-screen bg-paper py-12 px-[clamp(20px,5vw,76px)] animate-slide-in">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-[30px] md:text-[34px] font-serif text-ink tracking-tight">Posts</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search posts" 
              className="bg-surface border border-border-strong rounded-[14px] py-2.5 px-5 text-sm w-64 focus:outline-none focus:border-ink transition-colors placeholder:text-muted-soft"
            />
          </div>
          <button 
            onClick={() => setShowNewPostDialog(true)}
            className="bg-ink text-surface px-6 py-2.5 rounded-full text-[14px] font-semibold hover:bg-ink/90 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Published" value={published} />
        <StatCard title="Scheduled" value={scheduled} />
        <StatCard title="Drafts" value={drafts} />
        <StatCard title="Reads · last 30 days" value={formatViews(totalViews)} highlight={true} />
      </div>

      <div className="mb-6">
        <FilterChips 
          active={filter} 
          onChange={setFilter} 
          counts={{
            All: total,
            Published: published,
            Drafts: drafts,
            Scheduled: scheduled
          }}
        />
      </div>

      <div className="bg-surface rounded-[22px] shadow-sm border border-border/50 overflow-hidden pb-4">
        <PostsTable posts={filteredPosts} />
      </div>

      <NewPostDialog 
        open={showNewPostDialog} 
        onClose={() => setShowNewPostDialog(false)} 
      />
    </div>
  );
}

