import Link from 'next/link';
import StatusPill from './StatusPill';

export default function PostsTable({ posts = [] }) {
  if (posts.length === 0) {
    return (
      <div className="p-12 text-center text-muted">
        No posts found matching the current filter.
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-border/50 text-[11px] uppercase tracking-[0.06em] text-muted-soft font-bold">
          <th className="px-6 py-4 font-bold">POST</th>
          <th className="px-6 py-4 font-bold">TEMPLATE</th>
          <th className="px-6 py-4 font-bold">STATUS</th>
          <th className="px-6 py-4 font-bold">DATE</th>
          <th className="px-6 py-4 font-bold">READS</th>
          <th className="px-6 py-4"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/50">
        {posts.map(post => (
          <tr key={post.id} className="hover:bg-[#F7F5EF] transition-colors group">
            <td className="px-6 py-4">
              <Link href={`/studio/posts/${post.id}`} className="flex items-center gap-4">
                <div className="w-14 h-9 bg-accent-tint rounded-lg overflow-hidden shrink-0 shadow-sm border border-border/50">
                  {post.heroImage && (
                    <img src={post.heroImage} alt="" className="w-full h-full object-cover saturate-[0.78] contrast-[0.95]" />
                  )}
                </div>
                <div>
                  <span className="block font-bold text-ink text-[14px] group-hover:text-accent transition-colors leading-tight">
                    {post.title || 'Untitled Post'}
                  </span>
                  <span className="block text-[13px] text-muted-soft mt-0.5">
                    /blog/{post.slug || 'untitled'}
                  </span>
                </div>
              </Link>
            </td>
            <td className="px-6 py-4 text-[13px] text-muted font-medium capitalize">
              {post.mode === 'template' && post.template_id ? post.template_id.replace('-', ' ') : 'Custom'}
            </td>
            <td className="px-6 py-4">
              <StatusPill status={post.status} />
            </td>
            <td className="px-6 py-4 text-[13px] text-muted-soft">
              {post.updatedAt ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(post.updatedAt)) : 'Edited today'}
            </td>
            <td className="px-6 py-4 text-[14px] font-bold text-ink">
              {post.views ? post.views.toLocaleString() : '—'}
            </td>
            <td className="px-6 py-4 text-right">
              <button 
                className="text-muted-soft hover:text-ink px-2 py-1 transition-colors tracking-widest text-lg font-serif"
                title="Options"
              >
                ...
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
