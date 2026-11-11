import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SECRET } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || String(password).trim() !== ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin secret key. Access denied.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      token: ADMIN_SECRET,
      message: 'Admin authorization granted.',
    });

    // Set secure cookie
    response.cookies.set('ff_admin_token', ADMIN_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed.' }, { status: 500 });
  }
}
