// Mock data for auto-populated related posts preview
const MOCK_POSTS = [
  { title: 'The Future of Digital Banking', url: '#', date: 'Oct 12', readTime: '5 min' },
  { title: 'Maximizing Your Credit Rewards', url: '#', date: 'Oct 05', readTime: '8 min' },
  { title: 'Understanding APY and Interest', url: '#', date: 'Sep 28', readTime: '4 min' },
];

export default function RelatedPostsBlock({ data, editing }) {
  const { 
    mode = 'auto-by-tag', 
    count = 3, 
    heading = 'Related reading',
    posts = []
  } = data || {};

  // Use manual posts if in manual mode and posts exist, otherwise mock
  const displayPosts = (mode === 'manual' && posts.length > 0) 
    ? posts 
    : MOCK_POSTS.slice(0, count);

  const hasManualPosts = mode === 'manual' && posts.length > 0;

  return (
    <div className="my-12">
      {heading && (
        <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.3] text-ink mb-6">
          {heading}
        </h3>
      )}

      <div className="flex flex-col border-t border-border">
        {displayPosts.map((post, index) => (
          <a 
            key={index} 
            href={post.url || '#'} 
            className="group py-5 flex flex-col md:flex-row md:items-center justify-between border-b border-border hover:bg-accent/5 transition-colors -mx-4 px-4 rounded-[12px] md:rounded-none md:mx-0 md:px-0"
            onClick={(e) => editing && e.preventDefault()}
          >
            <h4 className="font-sans font-bold text-[17px] text-ink group-hover:text-accent transition-colors mb-2 md:mb-0 pr-4">
              {post.title || 'Untitled Post'}
            </h4>
            <div className="flex items-center gap-3 font-sans text-[13px] text-muted shrink-0">
              {post.date && <span>{post.date}</span>}
              {post.date && post.readTime && <span className="w-1 h-1 rounded-full bg-border" />}
              {post.readTime && <span>{post.readTime}</span>}
            </div>
          </a>
        ))}
      </div>
      
      {mode === 'auto-by-tag' && (
        <div className="mt-4 text-[11px] text-muted text-center uppercase tracking-wider">
          (Auto-populated by tags)
        </div>
      )}
      {mode === 'manual' && !hasManualPosts && editing && (
        <div className="mt-4 text-[11px] text-muted text-center uppercase tracking-wider">
          Add posts in the inspector →
        </div>
      )}
    </div>
  );
}
