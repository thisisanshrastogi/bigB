export default function PostHero({ data = {}, readingTime = null }) {
  const { title, excerpt, tags = [], category } = data;

  // Posts store the image as heroImage (string or object) depending on vintage,
  // and coverImage only exists on the oldest ones.
  const rawImage = data.coverImage || data.heroImage || null;
  const cover =
    typeof rawImage === 'string'
      ? { url: rawImage, alt: '' }
      : rawImage?.url
        ? { url: rawImage.url, alt: rawImage.alt || '' }
        : null;

  const rawAuthor = data.author || data.author_id || null;
  const author =
    typeof rawAuthor === 'string'
      ? { name: rawAuthor, avatar: null }
      : rawAuthor?.name
        ? { name: rawAuthor.name, avatar: rawAuthor.avatar || null }
        : null;

  const publishedAt = data.publishedAt || data.createdAt || null;
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : null;

  const meta = [
    formattedDate && (
      <time key="date" dateTime={new Date(publishedAt).toISOString()}>
        {formattedDate}
      </time>
    ),
    readingTime && <span key="read">{readingTime} min read</span>,
  ].filter(Boolean);

  return (
    <header className="mb-12">
      {(category || tags.length > 0) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {category && (
            <span className="rounded-full bg-accent-tint px-3 py-1 text-[12px] font-semibold capitalize text-accent">
              {category}
            </span>
          )}
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-sunken px-3 py-1 text-[12px] font-medium capitalize text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="mb-6 font-serif text-[34px] font-medium leading-[1.15] text-ink md:text-[42px] lg:text-[48px]">
        {title || 'Untitled post'}
      </h1>

      {excerpt && (
        <p className="mb-8 max-w-[640px] font-sans text-[18px] leading-[1.65] text-muted md:text-[20px]">
          {excerpt}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-muted">
        {author && (
          <span className="flex items-center gap-2.5">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-tint font-serif text-sm font-bold text-accent">
                {author.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="font-semibold text-ink">{author.name}</span>
          </span>
        )}

        {meta.map((node, i) => (
          <span key={node.key} className="flex items-center gap-3">
            {(author || i > 0) && <span className="text-border-strong">/</span>}
            {node}
          </span>
        ))}
      </div>

      {cover && (
        <figure className="mt-10 w-full overflow-hidden rounded-[24px] bg-surface-sunken shadow-sm">
          <img
            src={cover.url}
            alt={cover.alt || ''}
            className="aspect-[16/7] w-full object-cover"
            style={{ filter: 'saturate(0.85) contrast(0.97)' }}
          />
        </figure>
      )}
    </header>
  );
}