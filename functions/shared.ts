export interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  SESSION_SECRET: string;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

interface CacheOptions {
  browserTtl?: number;
  cdnTtl?: number;
  staleWhileRevalidateSeconds?: number;
  privacy?: 'public' | 'private';
  etag?: string;
  lastModified?: string;
}

export function cacheHeaders({
  browserTtl = 300,
  cdnTtl = 900,
  staleWhileRevalidateSeconds = 86400,
  privacy = 'public',
  etag,
  lastModified,
}: CacheOptions = {}): HeadersInit {
  const cacheControl: string[] = [privacy, `max-age=${browserTtl}`, `s-maxage=${cdnTtl}`];

  if (staleWhileRevalidateSeconds) {
    cacheControl.push(`stale-while-revalidate=${staleWhileRevalidateSeconds}`);
  }

  const sharedCacheValue = [
    privacy,
    `max-age=${cdnTtl}`,
    staleWhileRevalidateSeconds ? `stale-while-revalidate=${staleWhileRevalidateSeconds}` : undefined,
  ].filter(Boolean).join(', ');

  const headers: HeadersInit = {
    'Cache-Control': cacheControl.join(', '),
    'CDN-Cache-Control': sharedCacheValue,
    'Cloudflare-CDN-Cache-Control': sharedCacheValue,
  };

  if (etag) headers['ETag'] = etag;
  if (lastModified) headers['Last-Modified'] = lastModified;

  return headers;
}

export function noStoreHeaders(): HeadersInit {
  return {
    'Cache-Control': 'no-store',
    'CDN-Cache-Control': 'no-store',
    'Cloudflare-CDN-Cache-Control': 'no-store',
  };
}

export async function createEtag(payload: unknown): Promise<string> {
  const encoder = new TextEncoder();
  const json = JSON.stringify(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(json));
  let binary = '';
  const bytes = new Uint8Array(hashBuffer);
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const base64Hash = btoa(binary);
  return `W/"${base64Hash}"`;
}

export function etagMatches(ifNoneMatch: string | null, currentEtag: string): boolean {
  if (!ifNoneMatch) return false;
  if (ifNoneMatch.trim() === '*') return true;

  const candidates = ifNoneMatch.split(',').map((tag) => tag.trim()).filter(Boolean);
  return candidates.some((tag) => tag === currentEtag);
}

async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function verify(data: string, signature: string, secret: string): Promise<boolean> {
  const expected = await sign(data, secret);
  return signature === expected;
}

export async function createSessionCookie(email: string, secret: string): Promise<string> {
  const expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const data = JSON.stringify({ email, expires });
  const signature = await sign(data, secret);
  const value = btoa(data) + '.' + signature;

  return `session=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
}

export async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return false;

  const match = cookieHeader.match(/session=([^;]+)/);
  if (!match) return false;

  const [dataB64, signature] = match[1].split('.');
  if (!dataB64 || !signature) return false;

  try {
    const dataStr = atob(dataB64);
    const valid = await verify(dataStr, signature, env.SESSION_SECRET);
    if (!valid) return false;

    const { email, expires } = JSON.parse(dataStr);
    if (Date.now() > expires) return false;

    return email === 'emmerichhbrowne@gmail.com';
  } catch {
    return false;
  }
}
