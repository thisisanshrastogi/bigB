import { EditorProvider } from '@/studio/EditorProvider';
import EditorClientWrapper from '@/studio/editor/components/EditorClientWrapper';
import { mongoStore } from '@/lib/content/mongoDriver';
import { redirect, notFound } from 'next/navigation';
import { generateBlocksFromTemplate } from '@/lib/blog/templates';

export default async function EditorPage({ params, searchParams }) {
  const { id } = await params;
  const { template } = await searchParams;
  
  if (id === 'new') {
    const mode = template || 'custom';
    const initialBlocks = template ? generateBlocksFromTemplate(template) : [];
    const { title: titleParam, slug: slugParam } = await searchParams;
    
    // Create a new draft and immediately redirect to its actual ID
    const newPost = await mongoStore.createPost({
      title: titleParam || 'Untitled Post',
      slug: slugParam || `untitled-${Date.now()}`,
      status: 'draft',
      mode: mode,
      blocks: initialBlocks
    });
    redirect(`/studio/posts/${newPost.id}`);
  }

  let post = null;
  try {
    post = await mongoStore.getPost(id);
  } catch (error) {
    console.error(`Post not found: ${id}`);
    notFound();
  }

  // Convert to plain object for client component serialization
  const serializedPost = JSON.parse(JSON.stringify(post));

  return (
    <EditorProvider initialPost={serializedPost}>
      <EditorClientWrapper />
    </EditorProvider>
  );
}
