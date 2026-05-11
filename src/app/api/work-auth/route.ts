import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.WORK_PASSWORD || 'clea2025';

    if (password === correctPassword) {
      const secret = process.env.WORK_AUTH_SECRET || 'clea-work-secret-2025';
      const response = NextResponse.json({ success: true });

      response.cookies.set('work-auth', secret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
