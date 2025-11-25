import { Env } from '../shared';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const redirectUrl = url.origin;
  
  const headers = new Headers();
  
  const cookieOptions = 'Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; HttpOnly; Secure; SameSite=None';
  headers.append('Set-Cookie', `CF_Authorization=; ${cookieOptions}`);
  
  const accessLogoutUrl = `https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/logout`;
  
  headers.set('Location', accessLogoutUrl);
  
  return new Response(null, {
    status: 302,
    headers,
  });
};

