import mongoose from 'mongoose';

const BlockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  locked: { type: Boolean },
  required: { type: Boolean },
  slotLabel: { type: String },
  repeatingGroup: { type: String }
}, { _id: false });

const PostSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Post' },
  slug: { type: String, unique: true, sparse: true },
  excerpt: { type: String },
  status: { type: String, enum: ['draft', 'published', 'scheduled', 'archived'], default: 'draft' },
  mode: { type: String, default: 'custom' },
  template_id: { type: String },
  tags: [{ type: String }],
  heroImage: { type: String },
  socialShareImage: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  canonicalUrl: { type: String },
  author_id: { type: String },
  co_authors: [{ type: String }],
  visibility: { type: String, enum: ['public', 'unlisted', 'members-only', 'password'], default: 'public' },
  password: { type: String },
  publishedAt: { type: Date },
  scheduledAt: { type: Date },
  category_id: { type: String },
  category: { type: String },
  reading_time_minutes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  blocks: [BlockSchema],
  sections: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { 
  timestamps: true,
  collection: 'posts' 
});

// Avoid OverwriteModelError in Next.js HMR and allow schema updates
delete mongoose.models.Post;
const Post = mongoose.model('Post', PostSchema);

export default Post;
