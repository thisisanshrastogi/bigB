import { ContentStore } from './index';
import connectToDatabase from '../mongoose';
import Post from '../models/Post';
import Admin from '../models/Admin';

export class MongoContentStore extends ContentStore {
  async getPosts() {
    await connectToDatabase();
    // Use lean() to return POJOs instead of Mongoose documents
    // Ensure _id is converted to id
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    return posts.map(this._mapPost);
  }

  async getPost(id) {
    await connectToDatabase();
    // Try to find by id, if not fallback to slug
    const post = await Post.findById(id).lean().catch(() => null) || await Post.findOne({ slug: id }).lean();
    
    if (!post) throw new Error(`Post not found: ${id}`);
    return this._mapPost(post);
  }

  async createPost(postData) {
    await connectToDatabase();
    const post = new Post(postData);
    const saved = await post.save();
    return this._mapPost(saved.toObject());
  }

  async updatePost(id, version, postData) {
    await connectToDatabase();
    // Note: We're ignoring `version` for now (Optimistic Concurrency Control bypassed)
    // To support OCC, we would use `{ _id: id, __v: version }` and increment `__v`.
    
    const updated = await Post.findByIdAndUpdate(
      id,
      { $set: postData },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) throw new Error(`Post not found: ${id}`);
    return this._mapPost(updated);
  }

  async deletePost(id) {
    await connectToDatabase();
    const deleted = await Post.findByIdAndDelete(id).lean();
    if (!deleted) throw new Error(`Post not found: ${id}`);
    return this._mapPost(deleted);
  }

  // Maps Mongoose document to our expected application object
  _mapPost(doc) {
    if (!doc) return null;
    const { _id, __v, ...rest } = doc;
    return {
      id: _id.toString(),
      version: __v,
      ...rest,
    };
  }

  // Stubs for other methods
  async getCategories() { return []; }
  async getAuthors() { return []; }
  async getSettings() { return {}; }
  async putSettings(s) { return s; }

  // Admin Whitelist methods
  async getAdmins() {
    await connectToDatabase();
    const admins = await Admin.find().sort({ addedAt: -1 }).lean();
    return admins.map(a => a.email);
  }

  async addAdmin(email) {
    await connectToDatabase();
    const admin = new Admin({ email });
    await admin.save();
    return admin.email;
  }

  async removeAdmin(email) {
    await connectToDatabase();
    await Admin.findOneAndDelete({ email });
    return email;
  }
}

export const mongoStore = new MongoContentStore();
