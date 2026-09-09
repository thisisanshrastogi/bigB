import { MongoContentStore } from '@/lib/content/mongo';
import { revalidateTag } from 'next/cache';

const store = new MongoContentStore();

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    
    // In a real app we'd fetch the post, run preflight, change status to published, and save
    const post = await store.getPost(id);
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    // Set status to published
    await store.updatePost(id, post.version, { ...post, status: 'published' });

    // Revalidate Next.js cache
    revalidateTag('blog-index');
    revalidateTag(`post:${post.slug}`);
    if (post.categoryId) revalidateTag(`category:${post.categoryId}`);
    revalidateTag('sitemap');

    return Response.json({ status: 'published' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
