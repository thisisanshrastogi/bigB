"use client";
import { useEditor } from '@/studio/EditorProvider';
import { useState, useEffect, useRef, useId } from 'react';
import { validatePost } from '@/lib/utils/postValidation';

const inputClass =
  "w-full px-4 py-3 text-[15px] rounded-xl border border-rule bg-white text-ink placeholder:text-faint outline-none transition-colors focus:border-[#2E3C30] focus:ring-2 focus:ring-[#2E3C30]/10";

function Card({ children, className = '', tone = 'cream' }) {
  const toneClass = tone === 'white' ? 'bg-white' : 'bg-[#FDFCF9]';
  return (
    <div className={`${toneClass} rounded-[28px] sm:rounded-[32px] shadow-sm border border-[#E8E4D9] p-6 sm:p-8 flex flex-col gap-6 ${className}`}>
      {children}
    </div>
  );
}

function Field({ label, htmlFor, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-[13px] font-bold text-ink">{label}</label>
        {hint}
      </div>
      {children}
    </div>
  );
}

const Select = ({ id, value, onChange, children, selectRef }) => (
  <div className="relative">
    <select
      ref={selectRef}
      id={id}
      value={value}
      onChange={onChange}
      className={`${inputClass} appearance-none cursor-pointer pr-10`}
    >
      {children}
    </select>
    <svg
      className="w-4 h-4 text-faint absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
      fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

function StatusIcon({ tone }) {
  const styles = {
    success: 'bg-[#2E3C30] text-white',
    warn: 'bg-[#E5D5BA] text-[#8C6D3F]',
    error: 'bg-warn-bg text-warn-ink',
  };
  return (
    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${styles[tone]}`}>
      {tone === 'success' ? (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <span className="font-bold text-[12px] leading-none">!</span>
      )}
    </div>
  );
}

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.07 10.07 0 012.293-3.95m3.243-2.522A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.08 10.08 0 01-1.622 2.925M9.878 9.878a3 3 0 104.243 4.243" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
  </svg>
);

const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

export default function PostDetailsView() {
  const { post, updatePost, setSelectedBlockId, setViewMode } = useEditor();

  const [scheduleMode, setScheduleMode] = useState('publish_now');
  const [validation, setValidation] = useState({ errors: [], warnings: [] });
  const [tagsInput, setTagsInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const uid = useId();
  const excerptRef = useRef(null);
  const heroImageRef = useRef(null);
  const categoryRef = useRef(null);
  const slugRef = useRef(null);

  useEffect(() => {
    if (post) {
      setValidation(validatePost(post));
    }
  }, [post]);

  // Keep the raw tags text in sync when a different post loads. We don't
  // sync on every post change, otherwise the input fights the user's typing
  // (e.g. a trailing comma gets stripped mid-keystroke).
  useEffect(() => {
    setTagsInput((post?.tags || []).join(', '));
  }, [post?.id, post?._id]);

  if (!post) return null;

  const title = post.title || 'Untitled Post';
  const excerpt = post.excerpt || '';

  // Meta title / description / social image are optional overrides. Their
  // input value should reflect only what the user actually typed — the
  // fallback (post title / excerpt / hero image) is shown as a placeholder,
  // not baked into the value, so the character counters and the "is this
  // set" state stay honest.
  const metaTitleValue = post.metaTitle || '';
  const metaDescriptionValue = post.metaDescription || '';
  const effectiveMetaTitle = metaTitleValue || title;
  const effectiveMetaDescription = metaDescriptionValue || excerpt;
  const socialImage = post.socialShareImage || post.heroImage;

  const formatDatetimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const minSchedule = formatDatetimeLocal(new Date().toISOString());
  const canPublish = validation.errors.length === 0 && (scheduleMode === 'publish_now' || (scheduleMode === 'schedule' && !!post.scheduledAt));

  const commitTags = () => {
    const parsed = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    updatePost({ tags: parsed });
    setTagsInput(parsed.join(', '));
  };

  const focusField = (ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ref.current.focus({ preventScroll: true });
  };

  const checklistItems = [
    { done: excerpt.length > 0, label: `Excerpt written · ${excerpt.length} chars`, onClick: () => focusField(excerptRef) },
    { done: !!post.heroImage, label: `Hero image ${post.heroImage ? 'set' : 'missing'}`, onClick: () => focusField(heroImageRef) },
    { done: !!post.category, label: `Category · ${post.category || 'Missing'}`, onClick: () => focusField(categoryRef) },
    { done: !!post.slug, label: 'URL set', onClick: () => focusField(slugRef) },
  ];

  const handlePublish = async () => {
    if (!canPublish || isSaving) return;

    const previousStatus = post.status;
    const previousPublishedAt = post.publishedAt;

    const updatedPost = {
      ...post,
      status: scheduleMode === 'publish_now' ? 'published' : 'scheduled',
      publishedAt: scheduleMode === 'publish_now' ? new Date().toISOString() : null,
    };
    if (scheduleMode === 'schedule') {
      updatedPost.scheduledAt = new Date(post.scheduledAt).toISOString();
    }

    setSaveError(null);
    setIsSaving(true);
    updatePost({
      status: updatedPost.status,
      publishedAt: updatedPost.publishedAt,
    });

    try {
      const res = await fetch(`/api/studio/posts/${post.id || post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);

      if (scheduleMode === 'publish_now') {
        window.location.href = `/blog/${post.slug}`;
      } else {
        setViewMode('edit');
      }
    } catch (e) {
      console.error('Failed to publish', e);
      updatePost({ status: previousStatus, publishedAt: previousPublishedAt });
      setSaveError("Couldn't publish this post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnpublish = async () => {
    if (isSaving) return;
    const previousStatus = post.status;

    setSaveError(null);
    setIsSaving(true);
    updatePost({ status: 'draft' });

    try {
      const res = await fetch(`/api/studio/posts/${post.id || post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, status: 'draft' }),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      setViewMode('edit');
    } catch (e) {
      console.error('Failed to unpublish', e);
      updatePost({ status: previousStatus });
      setSaveError("Couldn't unpublish this post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckClick = (blockId) => {
    if (!blockId) return;
    setViewMode('edit');
    setSelectedBlockId(blockId);
    setTimeout(() => {
      const el = document.getElementById(`block-${blockId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="flex-1 w-full bg-[#F5F2EA] overflow-y-auto">
      <div className="max-w-[1400px] mx-auto w-full p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* MAIN COLUMN */}
          <div className="w-full lg:flex-1 lg:min-w-0 flex flex-col gap-6 order-2 lg:order-1">

            {/* IDENTITY */}
            <Card>
              <div>
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                  {post.category || 'Uncategorized'}
                </span>
                <h1 className="font-serif text-[28px] sm:text-[36px] leading-[1.15] text-ink mt-2">
                  {title}
                </h1>
              </div>

              <Field label="Title" htmlFor={`${uid}-title`}>
                <input
                  id={`${uid}-title`}
                  type="text"
                  value={post.title || ''}
                  onChange={e => updatePost({ title: e.target.value })}
                  className={inputClass}
                  placeholder="Post title"
                />
              </Field>

              <Field label="Slug" htmlFor={`${uid}-slug`}>
                <input
                  ref={slugRef}
                  id={`${uid}-slug`}
                  type="text"
                  value={post.slug || ''}
                  onChange={e => updatePost({ slug: e.target.value })}
                  className={inputClass}
                  placeholder="my-post-slug"
                />
              </Field>

              <Field
                label="Excerpt"
                htmlFor={`${uid}-excerpt`}
                hint={<span className={`text-[12px] font-bold ${excerpt.length > 160 ? 'text-warn-ink' : 'text-muted'}`}>{excerpt.length} / 160</span>}
              >
                <textarea
                  ref={excerptRef}
                  id={`${uid}-excerpt`}
                  value={post.excerpt || ''}
                  onChange={e => updatePost({ excerpt: e.target.value })}
                  className={`${inputClass} h-[100px] resize-none`}
                  placeholder="Brief summary of the post..."
                />
              </Field>
            </Card>

            {/* TAXONOMY + ACCESS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted">Taxonomy</h3>

                <Field label="Category" htmlFor={`${uid}-category`}>
                  <Select
                    id={`${uid}-category`}
                    value={post.category || ''}
                    onChange={e => updatePost({ category: e.target.value })}
                    selectRef={categoryRef}
                  >
                    <option value="">Select category</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Company">Company</option>
                  </Select>
                </Field>

                <Field
                  label="Tags"
                  htmlFor={`${uid}-tags`}
                  hint={<span className="text-[12px] text-faint">Comma separated</span>}
                >
                  <input
                    id={`${uid}-tags`}
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    onBlur={commitTags}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        commitTags();
                        e.currentTarget.blur();
                      }
                    }}
                    className={inputClass}
                    placeholder="tag1, tag2, tag3"
                  />
                </Field>
              </Card>

              <Card>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted">Access</h3>

                <Field label="Visibility" htmlFor={`${uid}-visibility`}>
                  <Select
                    id={`${uid}-visibility`}
                    value={post.visibility || 'public'}
                    onChange={e => updatePost({ visibility: e.target.value })}
                  >
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted (noindex)</option>
                    <option value="members-only">Members only</option>
                    <option value="password">Password protected</option>
                  </Select>
                </Field>

                {post.visibility === 'password' && (
                  <Field label="Password" htmlFor={`${uid}-password`}>
                    <div className="relative">
                      <input
                        id={`${uid}-password`}
                        type={showPassword ? 'text' : 'password'}
                        value={post.password || ''}
                        onChange={e => updatePost({ password: e.target.value })}
                        className={`${inputClass} pr-12`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-ink transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </Field>
                )}
              </Card>
            </div>

            {/* SEO */}
            <Card>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted">Search engine optimization</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                  <Field
                    label="Meta title"
                    htmlFor={`${uid}-metaTitle`}
                    hint={
                      <span className={`text-[12px] font-bold ${metaTitleValue.length === 0 ? 'text-muted' : metaTitleValue.length > 60 ? 'text-warn-ink' : 'text-forest'}`}>
                        {metaTitleValue.length} / 60
                      </span>
                    }
                  >
                    <input
                      id={`${uid}-metaTitle`}
                      type="text"
                      value={metaTitleValue}
                      onChange={e => updatePost({ metaTitle: e.target.value })}
                      className={`${inputClass} ${metaTitleValue.length > 60 ? 'border-warn-ink' : ''}`}
                      placeholder={title}
                    />
                  </Field>

                  <Field label="Canonical URL override" htmlFor={`${uid}-canonical`}>
                    <input
                      id={`${uid}-canonical`}
                      type="text"
                      value={post.canonicalUrl || ''}
                      onChange={e => updatePost({ canonicalUrl: e.target.value })}
                      className={inputClass}
                      placeholder="Optional canonical URL"
                    />
                  </Field>
                </div>

                <Field
                  label="Meta description"
                  htmlFor={`${uid}-metaDescription`}
                  hint={
                    <span className={`text-[12px] font-bold ${metaDescriptionValue.length === 0 ? 'text-muted' : (metaDescriptionValue.length < 120 || metaDescriptionValue.length > 158) ? 'text-warn-ink' : 'text-forest'}`}>
                      {metaDescriptionValue.length} / 120-158
                    </span>
                  }
                >
                  <textarea
                    id={`${uid}-metaDescription`}
                    value={metaDescriptionValue}
                    onChange={e => updatePost({ metaDescription: e.target.value })}
                    className={`${inputClass} h-[126px] resize-none`}
                    placeholder={excerpt || 'Defaults to excerpt...'}
                  />
                </Field>
              </div>
            </Card>

            {/* MEDIA + SOCIAL PREVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted">Media overrides</h3>

                <Field label="Hero image URL" htmlFor={`${uid}-hero`}>
                  <input
                    ref={heroImageRef}
                    id={`${uid}-hero`}
                    type="text"
                    value={post.heroImage || ''}
                    onChange={e => updatePost({ heroImage: e.target.value })}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </Field>

                <Field label="Social share image URL" htmlFor={`${uid}-social`}>
                  <input
                    id={`${uid}-social`}
                    type="text"
                    value={post.socialShareImage || ''}
                    onChange={e => updatePost({ socialShareImage: e.target.value })}
                    className={inputClass}
                    placeholder={post.heroImage || 'Overrides hero image...'}
                  />
                </Field>
              </Card>

              <Card tone="white" className="border-[#2E3C30]/15">
                <h3 className="text-[11px] font-bold text-muted uppercase tracking-wider">Social preview</h3>
                <div className="border border-rule rounded-[16px] overflow-hidden flex flex-col shadow-sm bg-white">
                  <div className="h-[140px] bg-placeholder flex items-center justify-center text-faint relative overflow-hidden">
                    {socialImage ? (
                      <img src={socialImage} alt="Social share preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <span className="text-[12px]">Add a hero image to preview</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-1 bg-[#F7F5EF]">
                    <div className="text-[11px] text-faint uppercase tracking-wider">amalgamic.io</div>
                    <div className="text-[14px] font-bold text-ink leading-tight mb-1 truncate">{effectiveMetaTitle}</div>
                    <div className="text-[13px] text-muted line-clamp-2 leading-[1.4]">{effectiveMetaDescription || 'No description yet.'}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-[360px] shrink-0 order-1 lg:order-2 lg:sticky lg:top-6">
            <Card tone="white" className="border-[#2E3C30]/20 shadow-md">
              <div>
                <h3 className="text-[11px] font-bold text-muted uppercase tracking-wider mb-5">Before it goes live</h3>

                <div className="flex flex-col gap-3 text-[14px] text-ink">
                  {checklistItems.map((item) => (
                    <div
                      key={item.label}
                      onClick={item.onClick}
                      className={`flex items-center gap-3 ${item.onClick ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''}`}
                    >
                      <StatusIcon tone={item.done ? 'success' : 'warn'} />
                      <span>{item.label}</span>
                    </div>
                  ))}

                  {validation.errors.map((err, i) => (
                    <div
                      key={`err-${i}`}
                      onClick={() => handleCheckClick(err.blockId)}
                      className={`flex items-start gap-3 text-warn-ink ${err.blockId ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''}`}
                    >
                      <StatusIcon tone="error" />
                      <span className="leading-tight mt-0.5">{err.message}</span>
                    </div>
                  ))}

                  {validation.warnings.map((warn, i) => (
                    <div
                      key={`warn-${i}`}
                      onClick={() => handleCheckClick(warn.blockId)}
                      className={`flex items-start gap-3 text-[#8C6D3F] ${warn.blockId ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''}`}
                    >
                      <StatusIcon tone="warn" />
                      <span className="leading-tight mt-0.5">{warn.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#E8E4D9] pt-6">
                <h3 className="text-[11px] font-bold text-muted uppercase tracking-wider mb-4">When</h3>

                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setScheduleMode('publish_now')}
                    className={`flex-1 py-3 rounded-full text-[13px] font-bold transition-all border ${scheduleMode === 'publish_now' ? 'bg-[#2E3C30] text-white border-[#2E3C30]' : 'bg-white text-ink border-rule hover:bg-surface'}`}
                  >
                    Publish now
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode('schedule')}
                    className={`flex-1 py-3 rounded-full text-[13px] font-bold transition-all border ${scheduleMode === 'schedule' ? 'bg-[#2E3C30] text-white border-[#2E3C30]' : 'bg-white text-ink border-rule hover:bg-surface'}`}
                  >
                    Schedule
                  </button>
                </div>

                {scheduleMode === 'schedule' && (
                  <input
                    type="datetime-local"
                    min={minSchedule}
                    value={formatDatetimeLocal(post.scheduledAt)}
                    onChange={e => updatePost({ scheduledAt: e.target.value })}
                    className={`${inputClass} text-[13px] mb-4`}
                  />
                )}

                {saveError && (
                  <div className="bg-warn-bg text-warn-ink text-[13px] rounded-xl p-3 mb-3">
                    {saveError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={!canPublish || isSaving}
                  className={`w-full py-4 rounded-full text-[15px] font-bold transition-all flex items-center justify-center gap-2 mt-2 ${canPublish && !isSaving ? 'bg-[#2E3C30] text-white hover:opacity-90 shadow-sm' : 'bg-surface text-muted cursor-not-allowed'}`}
                >
                  {isSaving && <Spinner />}
                  {isSaving ? 'Saving…' : post.status === 'published' ? 'Update live post' : (scheduleMode === 'publish_now' ? 'Publish now' : 'Schedule post')}
                </button>

                {post.status === 'published' && (
                  <button
                    type="button"
                    onClick={handleUnpublish}
                    disabled={isSaving}
                    className="w-full py-3 text-[13px] font-bold text-warn-ink hover:bg-warn-bg rounded-full transition-colors mt-2 disabled:opacity-50"
                  >
                    Unpublish
                  </button>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}