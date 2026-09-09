"use client";

import { useEffect, useState } from 'react';
import { extractHeadings, estimateReadingTime } from '@/lib/blog/headings';
import BlockRenderer from '@/blog/blocks/BlockRenderer';
import PostHero from '@/blog/components/PostHero';
import TableOfContents from '@/blog/components/TableOfContents';
import ArticleBody from '@/blog/components/ArticleBody';
import ReadingProgress from '@/blog/components/ReadingProgress';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function PreviewShell() {
  const [post, setPost] = useState(null);
  const [viewAs, setViewAs] = useState('Visitor');

  useEffect(() => {
    const handleMessage = (event) => {
      // Allow messages from the same origin
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'preview-update') {
        setPost(event.data.post);
        setViewAs(event.data.viewAs || 'Visitor');
      }
    };

    window.addEventListener('message', handleMessage);

    // Send a message to the parent window that the iframe is ready to receive data
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'preview-ready' }, window.location.origin);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // While waiting for the first message, render nothing or a subtle loader
  if (!post) {
    return <div className="min-h-screen bg-paper flex items-center justify-center text-muted">Loading preview...</div>;
  }

  // Access gating simulation
  let accessGranted = true;
  let gateType = null;
  let hideContent = false;

  if (viewAs === 'Search engine') {
    if (post.visibility !== 'public') {
      hideContent = true;
    }
  } else if (viewAs === 'Visitor') {
    if (post.visibility === 'password') {
      accessGranted = false;
      gateType = 'password';
    } else if (post.visibility === 'members-only') {
      accessGranted = false;
      gateType = 'members-only';
    }
  }

  if (hideContent) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <div className="font-mono text-xs text-muted whitespace-pre-wrap">
          {`<meta name="robots" content="noindex" />`}
        </div>
      </div>
    );
  }

  const blocks = post.blocks || [];
  const readingTime = estimateReadingTime(blocks);
  const headings = accessGranted ? extractHeadings(blocks) : [];
  const showRail = accessGranted;
  const postUrl = post.canonicalUrl || `https://amalgamic.io/blog/${post.slug || 'untitled'}`;

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      {/* 
        We disable links in the preview shell to prevent accidental navigation away from the preview.
      */}
      <div className="pointer-events-none" onClick={(e) => {
        // Prevent default navigation for all links but allow clicks on TOC links to scroll.
        const target = e.target.closest('a');
        if (target && !target.getAttribute('href')?.startsWith('#')) {
          e.preventDefault();
        }
      }}>
        {/* We want pointer-events-auto for children so we can scroll and click TOC, but we capture clicks above */}
        <div className="pointer-events-auto">
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
                  <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-rule bg-surface px-8 py-20 text-center relative z-10">
                    <h2 className="mb-4 font-serif text-3xl font-bold">
                      {gateType === 'password' ? 'This post needs a password' : 'Members only'}
                    </h2>
                    <p className="mb-8 max-w-sm text-muted">
                      {gateType === 'password'
                        ? 'Enter the password to read the rest.'
                        : 'Sign in to your Amalgamic account to read the rest.'}
                    </p>

                    {gateType === 'password' ? (
                      <div className="flex w-full max-w-sm gap-2">
                        <input
                          type="password"
                          placeholder="Password"
                          disabled
                          className="flex-1 rounded-full border border-rule px-4 py-3 outline-none"
                        />
                        <button
                          disabled
                          className="rounded-full bg-ink px-6 py-3 font-bold text-white opacity-50"
                        >
                          Unlock post
                        </button>
                      </div>
                    ) : (
                      <span className="rounded-full bg-ink px-8 py-3 font-bold text-white opacity-50">
                        Sign in
                      </span>
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
      </div>
    </div>
  );
}
