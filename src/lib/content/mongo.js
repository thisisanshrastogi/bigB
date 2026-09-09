import connectToDatabase from '../mongoose';
import { Post, Category, Author, Settings } from '../models';
import { ContentStore } from './index';

/**
 * MongoDB driver for ContentStore.
 */
export class MongoContentStore extends ContentStore {
  async getPosts() {
    await connectToDatabase();
    // In a real app we'd populate author and category if needed
    const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
    
    // Transform _id to id to match our interface
    return posts.map(this._mapId);
  }

  async getPost(slug) {
    await connectToDatabase();
    const post = await Post.findOne({ slug }).lean();
    return post ? this._mapId(post) : null;
  }

  async createPost(postData) {
    await connectToDatabase();
    const post = await Post.create(postData);
    return this._mapId(post.toObject());
  }

  async updatePost(id, version, postData) {
    await connectToDatabase();
    
    // Optimistic concurrency control check
    const post = await Post.findOneAndUpdate(
      { _id: id, version }, 
      { $set: { ...postData, version: version + 1 } },
      { new: true }
    ).lean();

    if (!post) {
      throw new Error("Conflict: Post was modified by someone else or does not exist.");
    }
    return this._mapId(post);
  }

  async getCategories() {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ order: 1 }).lean();
    return categories.map(this._mapId);
  }

  async getAuthors() {
    await connectToDatabase();
    const authors = await Author.find({}).lean();
    return authors.map(this._mapId);
  }

  async getSettings() {
    await connectToDatabase();
    const settings = await Settings.findOne({}).lean();
    return settings ? settings.data : {};
  }

  async putSettings(s) {
    await connectToDatabase();
    const settings = await Settings.findOneAndUpdate(
      {},
      { data: s },
      { new: true, upsert: true }
    ).lean();
    return settings.data;
  }

  _mapId(doc) {
    if (!doc) return doc;
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
  }
}
