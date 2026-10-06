import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first || request.headers.get('x-real-ip') || 'unknown';
}

function isLimited(ip: string): boolean {
  const now = Date.now();
  if (buckets.size > 1000) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
  }
  const existing = buckets.get(ip);
  if (!existing || existing.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  existing.count += 1;
  return existing.count > MAX_PER_WINDOW;
}

function oneLine(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function fail(status: number) {
  return NextResponse.json({ success: false }, { status });
}

export async function POST(request: Request) {
  if (isLimited(clientIp(request))) return fail(429);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail(400);
  }

  const name = oneLine(typeof body.name === 'string' ? body.name : '');
  const email = oneLine(typeof body.email === 'string' ? body.email : '');
  const phone = oneLine(typeof body.phone === 'string' ? body.phone : '');
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
    return fail(400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  // Set CONTACT_TO_ADDRESS in the host env. Do not commit an inbox address.
  const toAddress = process.env.CONTACT_TO_ADDRESS?.trim() ?? '';
  if (!apiKey || !toAddress || !EMAIL_RE.test(toAddress)) {
    console.error('contact: RESEND_API_KEY or CONTACT_TO_ADDRESS is not set');
    return fail(500);
  }

  const fromAddress =
    process.env.CONTACT_FROM_ADDRESS || 'Clea Solutions Website <contact@clea-solutions.ai>';

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || '(not provided)'}`,
    '',
    'Message:',
    description.replace(/\u0000/g, ''),
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
      to: [toAddress],
      reply_to: email,
      subject: `New inquiry from ${name}`,
      text: lines.join('\n'),
    }),
  });

  if (!res.ok) {
    console.error(`contact: Resend returned ${res.status}`);
    return fail(500);
  }

  return NextResponse.json({ success: true });
}
