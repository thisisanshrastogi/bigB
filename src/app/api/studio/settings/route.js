import { MongoContentStore } from '@/lib/content/mongo';

const store = new MongoContentStore();

export async function GET(request) {
  try {
    const settings = await store.getSettings();
    return Response.json(settings);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const settings = await store.putSettings(data);
    return Response.json(settings);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
