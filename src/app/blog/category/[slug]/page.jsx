import { FilesContentStore } from '@/lib/content/files';
import PostGrid from '@/blog/components/PostGrid';
import Pagination from '@/blog/components/Pagination';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const store = new FilesContentStore();
  
  // Fetch category details and related posts
  const posts = await store.getPosts();
  const categoryPosts = posts.filter(p => p.category_id === slug);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-serif text-brand mb-4 capitalize">Category: {slug}</h1>
          <p className="text-xl text-muted">Browse all posts in the {slug} category.</p>
        </header>

        {categoryPosts.length > 0 ? (
          <PostGrid posts={categoryPosts} />
        ) : (
          <p className="text-muted">No posts found in this category.</p>
        )}

        {categoryPosts.length > 0 && <Pagination />}
      </main>
      <Footer />
    </>
  );
}
