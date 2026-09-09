import { FilesContentStore } from '@/lib/content/files';
import FeaturedPost from '@/blog/components/FeaturedPost';
import CategoryChips from '@/blog/components/CategoryChips';
import PostGrid from '@/blog/components/PostGrid';
import Pagination from '@/blog/components/Pagination';
import NewsletterPatch from '@/blog/components/NewsletterPatch';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function BlogIndex() {
  const store = new FilesContentStore();
  const posts = await store.getPosts();

  const featured = posts.find(p => p.featured) || posts[0];
  const gridPosts = posts.filter(p => p.id !== featured?.id);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-serif text-brand mb-4">The Amalgamic Blog</h1>
          <p className="text-xl text-muted">Insights, guides, and updates on maximizing your credit cards.</p>
        </header>

        {featured && (
          <section className="mb-16">
            <FeaturedPost post={featured} />
          </section>
        )}

        <CategoryChips />

        <section className="my-12">
          <PostGrid posts={gridPosts} />
        </section>

        <Pagination />

        <section className="mt-24">
          <NewsletterPatch />
        </section>
      </main>
      <Footer />
    </>
  );
}
