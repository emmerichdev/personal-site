export interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  ACCESS_AUD: string;
  ACCESS_TEAM_DOMAIN: string;
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

interface AccessJWTPayload {
  email?: string;
  exp?: number;
  aud?: string[];
}

interface AccessJWK extends JsonWebKey {
  kid?: string;
}

interface JWKSResponse {
  keys: AccessJWK[];
}

interface JWTHeader {
  kid?: string;
  alg?: string;
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

async function getAccessPublicKeys(teamDomain: string): Promise<AccessJWK[]> {
  const response = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  const data = await response.json() as JWKSResponse;
  return data.keys;
}

async function verifyAccessJWT(token: string, teamDomain: string, aud: string): Promise<AccessJWTPayload | null> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !signatureB64) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64))) as AccessJWTPayload;

    if (payload.exp && payload.exp < Date.now() / 1000) return null;

    if (!payload.aud?.includes(aud)) return null;

    const keys = await getAccessPublicKeys(teamDomain);
    const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(headerB64))) as JWTHeader;

    const key = keys.find(k => k.kid === header.kid);
    if (!key) return null;

    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      key,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlDecode(signatureB64);

    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, signature, data);

    return valid ? payload : null;
  } catch {
    return null;
  }
}

export async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  if (request.headers.get('CF-Access-Authenticated-User-Email')) {
    return true;
  }

  const cookies = request.headers.get('Cookie') || '';
  const match = cookies.match(/CF_Authorization=([^;]+)/);
  if (!match) return false;

  const token = match[1];
  const payload = await verifyAccessJWT(token, env.ACCESS_TEAM_DOMAIN, env.ACCESS_AUD);

  return payload !== null && !!payload.email;
}
