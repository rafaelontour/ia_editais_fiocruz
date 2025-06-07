import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const response = await fetch('https://seu-backend.com/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  const { token } = await response.json();

  cookies().set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });

  return new Response('OK');
}
