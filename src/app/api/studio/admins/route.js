import { NextResponse } from 'next/server';
import { mongoStore } from '@/lib/content/mongoDriver';
import { auth } from '@/lib/auth';

// Helper to verify superadmin access
async function verifySuperadmin() {
  const session = await auth();
  if (!session || !session.user || (session.user.email !== 'lizann@amalgamic.io' && session.user.email !== 'thisisanshrastogi@gmail.com')) {
    return false;
  }
  return true;
}

export async function GET() {
  if (!(await verifySuperadmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
  try {
    const admins = await mongoStore.getAdmins();
    return NextResponse.json({ admins });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await verifySuperadmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    
    await mongoStore.addAdmin(email.toLowerCase());
    return NextResponse.json({ success: true, email });
  } catch (error) {
    // Check for duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Email is already whitelisted' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await verifySuperadmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    await mongoStore.removeAdmin(email.toLowerCase());
    return NextResponse.json({ success: true, email });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
