import Link from 'next/link';
import StatusPill from './StatusPill';

export default function PostsTable({ posts = [] }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <div className="w-16 h-16 bg-surface-sunken rounded-full flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-muted-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h3 className="text-[20px] font-serif text-ink mb-2">No posts found</h3>
        <p className="text-[14px] text-muted max-w-[40ch]">
          There are no posts matching your current filter. Try selecting a different status or clear your search.
        </p>
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
          <tr key={post.id} className="hover:bg-surface-sunken transition-colors group">
            <td className="px-6 py-4">
              <Link href={`/studio/posts/${post.id}`} className="flex items-center gap-4">
                <div className="w-16 h-10 bg-accent-tint rounded-[14px] overflow-hidden shrink-0 shadow-sm border border-border/50">
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
