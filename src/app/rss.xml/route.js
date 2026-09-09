import { FilesContentStore } from '@/lib/content/files';

export async function GET() {
  const store = new FilesContentStore();
  const posts = await store.getPosts();

  const publishedPosts = posts.filter(p => p.status === 'published');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Amalgamic Blog</title>
      <link>https://amalgamic.io/blog</link>
      <description>Insights, guides, and updates on maximizing your credit cards.</description>
      ${publishedPosts.map(post => `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>https://amalgamic.io/blog/${post.slug}</link>
          <description><![CDATA[${post.excerpt}]]></description>
          <guid>https://amalgamic.io/blog/${post.slug}</guid>
        </item>
      `).join('')}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
