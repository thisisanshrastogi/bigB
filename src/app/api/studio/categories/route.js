import { MongoContentStore } from '@/lib/content/mongo';

const store = new MongoContentStore();

export async function GET(request) {
  try {
    const categories = await store.getCategories();
    return Response.json(categories);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
