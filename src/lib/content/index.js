/**
 * ContentStore interface.
 * Defines the contract that all data drivers must fulfill.
 */
export class ContentStore {
  async getPosts() { throw new Error("Not implemented"); }
  async getPost(slug) { throw new Error("Not implemented"); }
  async createPost(postData) { throw new Error("Not implemented"); }
  async updatePost(id, version, postData) { throw new Error("Not implemented"); }
  
  async getCategories() { throw new Error("Not implemented"); }
  async getAuthors() { throw new Error("Not implemented"); }
  
  async getSettings() { throw new Error("Not implemented"); }
  async putSettings(s) { throw new Error("Not implemented"); }
}
