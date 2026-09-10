import { mongoStore } from '@/lib/content/mongoDriver';
import { extractHeadings, estimateReadingTime } from '@/lib/blog/headings';
import BlockRenderer from '@/blog/blocks/BlockRenderer';
import PostHero from '@/blog/components/PostHero';
import TableOfContents from '@/blog/components/TableOfContents';
import ArticleBody from '@/blog/components/ArticleBody';
import ReadingProgress from '@/blog/components/ReadingProgress';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'amalgamic-super-secret-jwt-key');

async function getPostData(slug, previewToken) {
  let post = null;
  try {
    post = (await mongoStore.getPostBySlug?.(slug)) || (await mongoStore.getPost(slug));
  } catch {
    return { post: null, isPreview: false };
  }

  if (!post) return { post: null, isPreview: false };

  let isPreview = false;
  if (previewToken) {
    try {
      const { payload } = await jwtVerify(previewToken, secret);
      if (payload.postId === post._id?.toString() || payload.postId === post.id) {
        isPreview = true;
      }
    } catch {
      // Invalid token, fall through to the published check.
    }
  }

  if (!isPreview) {
    if (post.status !== 'published') return { post: null, isPreview: false };
    if (post.scheduledAt && new Date(post.scheduledAt) > new Date()) {
      return { post: null, isPreview: false };
    }
  }

  return { post: JSON.parse(JSON.stringify(post)), isPreview };
}

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const { post } = await getPostData(slug, preview);

  if (!post) {
    return { title: 'Post not found — Amalgamic Blog' };
  }

  const title = post.metaTitle || post.title || 'Amalgamic Blog';
  const description = post.metaDescription || post.excerpt || '';
  const url = post.canonicalUrl || `https://amalgamic.io/blog/${slug}`;
  const images =
    post.socialShareImage || post.heroImage ? [post.socialShareImage || post.heroImage] : [];

  let robots = 'index, follow';
  if (
    post.visibility === 'unlisted' ||
    post.visibility === 'members-only' ||
    post.visibility === 'password'
  ) {
    robots = 'noindex, nofollow';
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    robots,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      authors: post.co_authors || [post.author_id],
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}



export function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5F2EA] px-6 py-24 text-center font-sans text-ink">
      <Navbar />
      <p className="text-[13px] font-medium tracking-[0.18em] text-muted">404</p>

      <h1 className="mt-6 max-w-3xl font-serif text-[2.6rem] leading-[1.08] tracking-[-0.015em] text-brand sm:text-[3.2rem] md:text-[3.9rem]">
        We couldn&rsquo;t find that page.
      </h1>

      <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted md:text-[17px]">
        The link may be old, or the post has been taken down.
      </p>

      <Link
        href="/"
        className="mt-10 rounded-full bg-ink px-7 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Back to the blog
      </Link>
    </main>
  );
}

export default async function PostPage({ params, searchParams }) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const { post, isPreview } = await getPostData(slug, preview);

  if (!post) {
    return (
      <NotFound />
    );
  }

  // Access gating
  let accessGranted = isPreview;
  let gateType = null;

  if (!accessGranted) {
    if (post.visibility === 'public' || post.visibility === 'unlisted') {
      accessGranted = true;
    } else if (post.visibility === 'password') {
      const cookieStore = await cookies();
      const pwCookie = cookieStore.get(`post-pw-${post._id || post.id}`);
      if (pwCookie?.value === post.password) {
        accessGranted = true;
      } else {
        gateType = 'password';
      }
    } else if (post.visibility === 'members-only') {
      const cookieStore = await cookies();
      if (cookieStore.get('session-token')) {
        accessGranted = true;
      } else {
        gateType = 'members-only';
      }
    }
  }

  const blocks = post.blocks || [];
  const readingTime = estimateReadingTime(blocks);
  const headings = accessGranted ? extractHeadings(blocks) : [];
  const showRail = accessGranted;
  const postUrl = post.canonicalUrl || `https://amalgamic.io/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.metaTitle || post.title,
    image: post.heroImage ? [post.heroImage] : [],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author_id || 'Amalgamic Team',
    },
  };

  async function unlock(formData) {
    'use server';
    const submitted = formData.get('password');
    if (submitted === post.password) {
      const cookieStore = await cookies();
      cookieStore.set(`post-pw-${post._id || post.id}`, submitted, {
        path: '/',
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'lax',
      });
      // Without this the cookie is set but the page never re-renders.
      revalidatePath(`/blog/${slug}`);
    }
  }

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Navbar />
      <ReadingProgress />

      <div className="pt-[120px] md:pt-[152px]">
        <div
          className={`mx-auto grid max-w-[1140px] grid-cols-1 gap-x-16 px-5 pb-32 lg:px-10 ${showRail ? 'min-[1100px]:grid-cols-[minmax(0,760px)_200px] justify-start xl:justify-center' : 'justify-center'
            }`}
        >
          <article className="w-full max-w-[760px]">
            <PostHero data={post} readingTime={readingTime} />

            {!accessGranted ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-rule bg-surface px-8 py-20 text-center">
                <h2 className="mb-4 font-serif text-3xl font-bold">
                  {gateType === 'password' ? 'This post needs a password' : 'Members only'}
                </h2>
                <p className="mb-8 max-w-sm text-muted">
                  {gateType === 'password'
                    ? 'Enter the password to read the rest.'
                    : 'Sign in to your Amalgamic account to read the rest.'}
                </p>

                {gateType === 'password' ? (
                  <form action={unlock} className="flex w-full max-w-sm gap-2">
                    <label htmlFor="post-password" className="sr-only">
                      Password
                    </label>
                    <input
                      id="post-password"
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="flex-1 rounded-full border border-rule px-4 py-3 outline-none focus:border-forest"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-ink px-6 py-3 font-bold text-white"
                    >
                      Unlock post
                    </button>
                  </form>
                ) : (
                  <Link
                    href={`/signin?next=/blog/${slug}`}
                    className="rounded-full bg-ink px-8 py-3 font-bold text-white"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-8">
                <ArticleBody>
                  <BlockRenderer blocks={blocks} headings={headings} />
                </ArticleBody>
              </div>
            )}
          </article>

          {showRail && (
            <aside className="hidden min-[1100px]:block">
              <div className="sticky top-[120px] max-h-[calc(100vh-160px)] overflow-y-auto pl-2">
                <TableOfContents
                  headings={headings}
                  totalReadingTime={readingTime}
                  railPosition="right"
                  title={post.title}
                  url={postUrl}
                />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}