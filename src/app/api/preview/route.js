import { SignJWT, jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'amalgamic-super-secret-jwt-key');

export async function POST(request) {
  try {
    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    // Create a JWT that expires in 7 days
    const jwt = await new SignJWT({ postId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    return NextResponse.json({ token: jwt });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return NextResponse.json({ valid: true, payload });
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Expired or invalid token' }, { status: 401 });
  }
}
