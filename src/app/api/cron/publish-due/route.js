import { MongoContentStore } from '@/lib/content/mongo';
import { revalidateTag } from 'next/cache';

const store = new MongoContentStore();

export async function GET(request) {
  // Verify secret header from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // In a full implementation we'd find all 'scheduled' posts where scheduledFor <= now()
    // and update their status to 'published'
    let processed = 0;
    
    // Pseudo-code:
    // const duePosts = await Post.find({ status: 'scheduled', scheduledFor: { $lte: new Date() } });
    // for (const p of duePosts) {
    //   await store.updatePost(p._id, p.version, { ...p, status: 'published', publishedAt: new Date() });
    //   revalidateTag('blog-index');
    //   revalidateTag(`post:${p.slug}`);
    //   processed++;
    // }

    return Response.json({ processed });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
