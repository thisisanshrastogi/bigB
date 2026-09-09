import fs from 'fs/promises';
import path from 'path';
import { ContentStore } from './index';

/**
 * Files driver for ContentStore.
 * Reads content from local JSON fixtures.
 */
export class FilesContentStore extends ContentStore {
  constructor() {
    super();
    // In blog-app, process.cwd() is likely amalgamic-react/blog-app
    this.fixturesPath = path.join(process.cwd(), '../content/fixtures');
  }

  async getPosts() {
    try {
      const data = await fs.readFile(path.join(this.fixturesPath, 'posts.json'), 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  async getPost(slug) {
    const posts = await this.getPosts();
    return posts.find(p => p.slug === slug);
  }
}
