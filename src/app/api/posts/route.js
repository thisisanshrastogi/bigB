import { NextResponse } from 'next/server';
import { mongoStore } from '@/lib/content/mongoDriver';

export async function GET() {
  try {
    const posts = await mongoStore.getPublishedPosts();
    return NextResponse.json(posts, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}