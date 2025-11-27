import { Env } from '../shared';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, params } = context;
  
  const path = Array.isArray(params.path) ? params.path.join('/') : params.path;
  
  if (!path) {
    return new Response('Not found', { status: 404 });
  }
  
  try {
    const object = await env.MEDIA_BUCKET.get(path);
    
    if (!object) {
      return new Response('Not found', { status: 404 });
    }
    
    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=31536000');
    headers.set('ETag', object.httpEtag);
    
    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Error serving media:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
