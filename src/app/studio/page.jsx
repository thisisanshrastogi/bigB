import { mongoStore } from '@/lib/content/mongoDriver';
import DashboardClient from '@/studio/dashboard/components/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function StudioPostsPage() {
  let posts = [];
  try {
    posts = await mongoStore.getPosts();
  } catch (e) {
    console.error('Failed to load posts from MongoDB', e);
  }

  // Convert posts to plain objects to pass to Client Component (serialization)
  // And remove non-serializable elements if any
  const serializedPosts = JSON.parse(JSON.stringify(posts));

  return <DashboardClient initialPosts={serializedPosts} />;
}
