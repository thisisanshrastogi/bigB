import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: ['draft', 'scheduled', 'published', 'unpublished', 'trash'], default: 'draft' },
  mode: { type: String, enum: ['template', 'custom'], default: 'template' },
  templateId: { type: String },
  title: { type: String, default: '' },
  excerpt: { type: String, default: '' },
  categoryId: { type: String },
  authorId: { type: String },
  hero: { type: Schema.Types.Mixed }, // JSON for hero media
  sections: { type: Schema.Types.Mixed }, // Template sections
  blocks: { type: [Schema.Types.Mixed], default: [] }, // Custom blocks
  seo: { type: Schema.Types.Mixed, default: {} },
  tags: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  readingTimeMinutes: { type: Number, default: 0 },
  publishedAt: { type: Date },
  scheduledFor: { type: Date },
  version: { type: Number, default: 1 },
}, { timestamps: true });

const RevisionSchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  body: { type: Schema.Types.Mixed, required: true }, // The state of the post at this revision
  promoted: { type: Boolean, default: false },
}, { timestamps: true });

const MediaSchema = new Schema({
  filename: String,
  mime: String,
  bytes: Number,
  width: Number,
  height: Number,
  blurhash: String,
  variants: Schema.Types.Mixed, // Object for different sizes
  alt: { type: String, default: '' },
  folder: String,
  url: String, // Cloudinary URL
  public_id: String // Cloudinary public ID for deletion
}, { timestamps: true });

const CategorySchema = new Schema({
  name: String,
  slug: { type: String, unique: true },
  description: String,
  order: Number
});

const AuthorSchema = new Schema({
  name: String,
  role: String,
  bio: String,
  avatar: Schema.Types.Mixed,
  links: Schema.Types.Mixed
});

const SettingsSchema = new Schema({
  data: { type: Schema.Types.Mixed, required: true }
});

export const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export const Revision = mongoose.models.Revision || mongoose.model('Revision', RevisionSchema);
export const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema);
export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const Author = mongoose.models.Author || mongoose.model('Author', AuthorSchema);
export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
export const Subscriber = mongoose.models.Subscriber || require('./Subscriber').default;
