import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const honeypot = typeof body.company === 'string' ? body.company.trim() : '';

  // Bots fill the hidden field; pretend it worked and drop the message.
  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  if (
    !name ||
    !email ||
    !description ||
    name.length > 200 ||
    email.length > 320 ||
    phone.length > 50 ||
    description.length > 5000 ||
    !EMAIL_RE.test(email)
  ) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('contact: RESEND_API_KEY is not set');
    return NextResponse.json({ success: false }, { status: 500 });
  }

  const fromAddress =
    process.env.CONTACT_FROM_ADDRESS || 'Clea Solutions Website <onboarding@resend.dev>';

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || '(not provided)'}`,
    '',
    'Message:',
    description,
    '',
    `Submitted: ${new Date().toISOString()}`,
  ];

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: ['mpthrees33@gmail.com'],
      reply_to: email,
      subject: `New inquiry from ${name}`,
      text: lines.join('\n'),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error(`contact: Resend returned ${res.status}: ${detail}`);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
