import { NextResponse } from 'next/server';
import { mongoStore } from '@/lib/content/mongoDriver';

export async function GET(request, { params }) {
  try {
    const id = params.id; // params.id in App router is a string, await is not strictly needed in all Next.js versions but Next 15 might require await. However Next 14 handles it synchronously well, wait actually Next 14 expects it synchronously, next 15 expects await. We will await it to be safe if it's a promise, but it's fine.
    const resolvedParams = await params;
    const post = await mongoStore.getPost(resolvedParams.id);
    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error fetching post ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const data = await request.json();
    
    // Prevent empty slug to avoid MongoDB duplicate key errors on sparse unique index
    if (data.slug === '') {
      data.slug = `untitled-${id}`;
    }

    // Default version to 0 if not provided
    const version = data.version || 0;

    const updatedPost = await mongoStore.updatePost(id, version, data);
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`Error updating post ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    await mongoStore.deletePost(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting post ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
