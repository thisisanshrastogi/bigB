import { NextResponse } from 'next/server';
import { mongoStore } from '@/lib/content/mongoDriver';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    await mongoStore.addSubscriber(email);

    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
