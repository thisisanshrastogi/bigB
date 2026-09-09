import { NextResponse } from 'next/server';
import { mongoStore } from '@/lib/content/mongoDriver';

export async function GET(request) {
  try {
    const posts = await mongoStore.getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Default values for a new post
    const postData = {
      title: body.title || 'Untitled Post',
      mode: body.mode || 'custom',
      status: 'draft',
      blocks: [],
      ...body,
      slug: body.slug || `untitled-${Date.now()}`
    };

    const newPost = await mongoStore.createPost(postData);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
