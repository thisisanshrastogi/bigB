// Mock data for related posts preview
const MOCK_POSTS = [
  { id: 'p1', title: 'The Future of Digital Banking', date: 'Oct 12', readTime: '5 min' },
  { id: 'p2', title: 'Maximizing Your Credit Rewards', date: 'Oct 05', readTime: '8 min' },
  { id: 'p3', title: 'Understanding APY and Interest', date: 'Sep 28', readTime: '4 min' },
];

export default function RelatedPostsBlock({ data }) {
  const { 
    mode = 'auto-by-tag', 
    count = 3, 
    heading = 'Related reading',
    posts = '' // In a real app this would be an array of IDs from the repeatable field
  } = data || {};

  // Mocking the resolution of posts
  const displayPosts = MOCK_POSTS.slice(0, count);

  return (
    <div className="my-12">
      {heading && (
        <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.3] text-ink mb-6">
          {heading}
        </h3>
      )}

      <div className="flex flex-col border-t border-[#E2DFD5]">
        {displayPosts.map((post, index) => (
          <a 
            key={index} 
            href={`#post-${post.id}`} 
            className="group py-5 flex flex-col md:flex-row md:items-center justify-between border-b border-[#E2DFD5] hover:bg-[#F7F5EF]/50 transition-colors -mx-4 px-4 rounded-[12px] md:rounded-none md:mx-0 md:px-0"
          >
            <h4 className="font-sans font-bold text-[17px] text-ink group-hover:text-accent transition-colors mb-2 md:mb-0 pr-4">
              {post.title}
            </h4>
            <div className="flex items-center gap-3 font-sans text-[13px] text-muted shrink-0">
              <span>{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-[#E2DFD5]" />
              <span>{post.readTime}</span>
            </div>
          </a>
        ))}
      </div>
      
      {mode === 'auto-by-tag' && (
        <div className="mt-4 text-[11px] text-muted text-center uppercase tracking-wider">
          (Auto-populated by tags)
        </div>
      )}
    </div>
  );
}
