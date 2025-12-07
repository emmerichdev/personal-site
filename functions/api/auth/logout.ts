import { Env } from '../../shared';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const headers = new Headers();

  const cookieOptions = 'Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; Secure; SameSite=Lax';
  headers.append('Set-Cookie', `session=; ${cookieOptions}`);

  headers.set('Location', '/');

  return new Response(null, {
    status: 302,
    headers,
  });
};

