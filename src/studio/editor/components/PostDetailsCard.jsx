"use client";
import { useEditor } from '@/studio/EditorProvider';

export default function PostDetailsCard() {
  const { post, updatePost } = useEditor();

  if (!post) return null;

  return (
    <div className="bg-[#F2EFE8] rounded-[18px] p-5">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-4">Post Details</h4>
      
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Post Title"
          value={post.title || ''}
          onChange={e => updatePost({ title: e.target.value })}
          className="w-full px-3 py-2 text-[15px] font-bold rounded-lg border border-border focus:border-accent outline-none bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        />

        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Slug · sapphire-reserve-review"
            value={post.slug || ''}
            onChange={e => updatePost({ slug: e.target.value })}
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-border focus:border-accent outline-none bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] min-w-0"
          />
          <select 
            className="w-full px-3 py-2 text-[13px] rounded-lg border border-border focus:border-accent outline-none bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] min-w-0"
            value={post.category || 'Product'}
            onChange={e => updatePost({ category: e.target.value })}
          >
            <option>Product</option>
            <option>Card picks</option>
            <option>Reviews</option>
            <option>News</option>
          </select>
        </div>

        <textarea 
          placeholder="Excerpt - The fee went up. Three of the credits got easier. Whether it still pays depends on two numbers."
          value={post.excerpt || ''}
          onChange={e => updatePost({ excerpt: e.target.value })}
          className="w-full px-3 py-2 text-[13px] rounded-lg border border-border focus:border-accent outline-none bg-white resize-none h-[64px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        />

        <input 
          type="text" 
          placeholder="Hero Image URL (e.g., https://images.unsplash.com/...)"
          value={post.heroImage || ''}
          onChange={e => updatePost({ heroImage: e.target.value })}
          className="w-full px-3 py-2 text-[13px] rounded-lg border border-border focus:border-accent outline-none bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        />
        
        <p className="text-[10px] text-muted pt-1">
          Everything the reader sees is on this panel — no separate settings screen.
        </p>
      </div>
    </div>
  );
}
