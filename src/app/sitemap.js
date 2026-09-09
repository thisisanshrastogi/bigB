import { FilesContentStore } from '@/lib/content/files';

export default async function sitemap() {
  const store = new FilesContentStore();
  const posts = await store.getPosts();

  const blogPosts = posts
    .filter((post) => post.status === 'published')
    .map((post) => ({
      url: `https://amalgamic.io/blog/${post.slug}`,
      lastModified: new Date(),
    }));

  return [
    {
      url: 'https://amalgamic.io/blog',
      lastModified: new Date(),
    },
    ...blogPosts,
  ];
}
