"use client";

/**
 * Blog index — amalgamic.io visual language.
 *
 * Tokens this file assumes (tailwind.config):
 *   paper  #F5F2EA   ink   #171613   brand (display ink)  muted   border
 *   forest #123A2E   mint  #64B387
 * No mint on this page — the featured card sits on a light ground, and the
 * newsletter CTA is white on pine.
 */

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowUpDown } from 'lucide-react';
import Navbar from '@/components/Navbar';

const CATEGORIES = ['All', 'How-to', 'Card reviews', 'Comparisons', 'Explainers', 'News'];

const categoryOf = (post) =>
  typeof post?.category === 'string' ? post.category : post?.category?.name || '';

const heroOf = (post) => post?.heroImage || post?.hero?.url || null;

export default function BlogClient() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [newestFirst, setNewestFirst] = useState(true);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle, loading, success, error

  useEffect(() => {
    let alive = true;
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const counts = useMemo(() => {
    const map = { All: posts.length };
    for (const c of CATEGORIES.slice(1)) {
      map[c] = posts.filter((p) => categoryOf(p) === c).length;
    }
    return map;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const out = posts.filter((post) => {
      if (category !== 'All' && categoryOf(post) !== category) return false;
      if (!q) return true;
      return (
        post.title?.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q)
      );
    });
    return out.sort((a, b) => {
      const da = new Date(a.publishedAt || 0).getTime();
      const db = new Date(b.publishedAt || 0).getTime();
      return newestFirst ? db - da : da - db;
    });
  }, [posts, category, search, newestFirst]);

  const isBrowsing = category === 'All' && !search.trim();
  const featuredPost = isBrowsing ? filteredPosts[0] : null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return '';
    const sameYear = d.getFullYear() === new Date().getFullYear();
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(sameYear ? {} : { year: 'numeric' }),
    });
  };

  const reset = () => {
    setSearch('');
    setCategory('All');
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      
      if (!res.ok) throw new Error('Failed to subscribe');
      setNewsletterStatus('success');
    } catch (err) {
      console.error(err);
      setNewsletterStatus('error');
    }
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F5F2EA] font-sans text-ink selection:bg-ink selection:text-[#F5F2EA]">
      <Navbar />

      <main className="mx-auto mt-20 max-w-[1300px] px-4 pb-24 pt-16 md:px-6 lg:px-28">
        {/* Masthead */}
        <header className="mb-14 max-w-2xl">
          <h1 className="font-serif text-[2.6rem] leading-[1.05] tracking-[-0.015em] text-brand md:text-[3.4rem]">
            Everything we&rsquo;ve written,
            <br />
            by topic
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
            <span className="tabular-nums text-ink">{posts.length}</span> posts,
            updated whenever an issuer changes the rules underneath us.
          </p>
        </header>

        {/* Controls */}
        <div className="mb-10 border-y border-border/70 py-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(cat)}
                    className={[
                      'rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-150',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
                      active
                        ? 'bg-ink font-medium text-[#F5F2EA]'
                        : 'text-muted hover:bg-ink/5 hover:text-ink',
                    ].join(' ')}
                  >
                    {cat}
                    {counts[cat] > 0 && (
                      <span
                        className={`ml-1.5 tabular-nums text-[11px] ${active ? 'text-[#F5F2EA]/55' : 'text-muted/60'}`}
                      >
                        {counts[cat]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex w-full items-center gap-2 lg:w-auto">
              <div className="relative w-full lg:w-60">
                <label htmlFor="post-search" className="sr-only">
                  Search posts
                </label>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-muted"
                  strokeWidth={1.75}
                />
                <input
                  id="post-search"
                  type="search"
                  placeholder="Search posts"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-border bg-white/70 py-2 pl-9 pr-4 text-[13px] text-ink placeholder-muted transition-colors focus:border-ink/40 focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setNewestFirst((v) => !v)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-[12px] text-muted transition-colors hover:border-ink/30 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
                {newestFirst ? 'Newest' : 'Oldest'}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="mb-14 h-[400px] rounded-[28px] bg-ink/[0.07]" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-ink/[0.06]" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Featured — contained card: outer frame, inset art, text beside it */}
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group mb-14 block focus-visible:outline-none"
              >
                <article className="rounded-[28px]  border-border bg-paper p-2.5 transition-colors duration-200 group-hover:border-ink/0 group-focus-visible:border-ink md:grid md:grid-cols-[1.05fr_0.95fr] md:items-stretch md:gap-2.5">
                  <div className="relative h-60 overflow-hidden rounded-[20px] bg-[#E6E3D8] sm:h-72 md:h-full md:min-h-[400px]">
                    {heroOf(featuredPost) && (
                      <Image
                        src={heroOf(featuredPost)}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                      />
                    )}
                  </div>

                  <div className="flex flex-col px-4 pb-6 pt-7 md:px-10 md:py-12">
                    <span className="text-[12px] text-muted">
                      {categoryOf(featuredPost) || 'Latest'}
                    </span>
                    <h2 className="mt-3 max-w-md font-serif text-[1.7rem] leading-[1.15] tracking-[-0.01em] text-brand md:text-[2.1rem]">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-8 flex items-center gap-3 border-t border-border/70 pt-4 md:mt-auto md:pt-6">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/[0.07] text-[11px] text-ink">
                        {(featuredPost.author?.name || 'Amalgamic').charAt(0)}
                      </span>
                      <span className="text-[13px] text-ink">
                        {featuredPost.author?.name || 'Amalgamic Team'}
                      </span>
                      <span className="ml-auto text-[12px] tabular-nums text-muted/80">
                        {formatDate(featuredPost.publishedAt)}
                        {featuredPost.readingTimeMinutes
                          ? `, ${featuredPost.readingTimeMinutes} min read`
                          : ''}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => (
                  <Link
                    key={post.id || post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                  >
                    <article className="flex h-full flex-col">
                      <div className="relative h-48 overflow-hidden rounded-2xl bg-[#E6E3D8]">
                        {heroOf(post) && (
                          <Image
                            src={heroOf(post)}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                          />
                        )}
                      </div>

                      <div className="flex flex-grow flex-col pt-5">
                        <span className="text-[12px] text-muted">
                          {categoryOf(post) || 'Article'}
                        </span>
                        <h3 className="mt-2 font-serif text-[1.2rem] leading-snug text-brand decoration-ink/25 underline-offset-4 group-hover:underline">
                          {post.title}
                        </h3>
                        <p className="mt-2.5 text-[14px] leading-relaxed text-muted line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="mt-5 flex items-center gap-2 border-t border-border/70 pt-3 text-[12px] tabular-nums text-muted/80">
                          <span>{formatDate(post.publishedAt)}</span>
                          {post.readingTimeMinutes ? (
                            <span className="ml-auto">{post.readingTimeMinutes} min read</span>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {filteredPosts.length === 0 && (
              <div className="border-t border-border/70 py-20">
                <p className="font-serif text-[1.5rem] text-brand">Nothing here yet.</p>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted">
                  No posts match that filter. Try a different topic, or clear what
                  you&rsquo;ve set.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 rounded-full bg-ink px-5 py-2 text-[13px] text-[#F5F2EA] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Show all posts
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Newsletter — pine ground, the one place mint earns its keep */}
      <section
        id="newsletter-section"
        className="mx-auto max-w-[1300px] px-4 pb-24 md:px-6 lg:px-28"
      >
        <div className="relative overflow-hidden rounded-[22px] bg-forest px-6 py-10 md:px-[40px] md:py-[48px]">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center text-left">
            <div className="text-white">
              <h2 className="font-serif text-[28px] md:text-[32px] leading-[1.3] m-0 mb-4">
                The fine print, in your inbox on Thursdays
              </h2>
              <p className="font-sans text-[16px] leading-[1.6] m-0 text-white/70">
                Two posts a week. No affiliate spam, and one click to leave.
              </p>
            </div>

            {newsletterStatus === 'success' ? (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-forest">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-serif text-[20px] md:text-[24px] text-white m-0 leading-tight">
                  You have been added to the mailing list.
                </p>
              </div>
            ) : (
              <form
                className="w-full relative flex flex-col sm:flex-row gap-3"
                onSubmit={handleNewsletterSubmit}
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterStatus === 'loading'}
                  placeholder="you@example.com"
                  className="w-full sm:flex-1 h-[56px] px-6 rounded-full border border-white/20 bg-white/10 text-[16px] text-white placeholder-white/50 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50 min-w-0"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="w-full sm:w-auto h-[56px] px-10 rounded-full bg-white text-[16px] font-bold text-forest transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50 shrink-0"
                >
                  {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
                {newsletterStatus === 'error' && (
                  <div className="absolute -bottom-8 left-0 text-[13px] text-red-300">
                    Something went wrong. Please try again.
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}