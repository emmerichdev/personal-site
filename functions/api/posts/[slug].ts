import { Env, Post, isAuthenticated, corsHeaders, cacheHeaders, noStoreHeaders, createEtag, etagMatches } from '../../shared';

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: corsHeaders() });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, params, request } = context;
  const slug = params.slug as string;

  try {
    const post = await env.DB.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).first<Post>();

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(), ...noStoreHeaders() },
      });
    }

    if (!post.published && !await isAuthenticated(request, env)) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(), ...noStoreHeaders() },
      });
    }

    const payload = JSON.stringify({ post });
    const baseHeaders = { 'Content-Type': 'application/json', ...corsHeaders() };

    if (!post.published) {
      return new Response(payload, {
        headers: { ...baseHeaders, ...noStoreHeaders() },
      });
    }

    const etag = await createEtag(post);
    const lastModified = post.updated_at ? new Date(post.updated_at).toUTCString() : undefined;
    const caching = cacheHeaders({
      browserTtl: 300,
      cdnTtl: 900,
      staleWhileRevalidateSeconds: 86400,
      etag,
      lastModified,
    });

    if (etagMatches(request.headers.get('If-None-Match'), etag)) {
      return new Response(null, {
        status: 304,
        headers: { ...baseHeaders, ...caching },
      });
    }

    return new Response(payload, {
      headers: { ...baseHeaders, ...caching },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { env, params, request } = context;
  const slug = params.slug as string;

  if (!await isAuthenticated(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  try {
    const body = await request.json() as Partial<Post>;
    const { title, excerpt, content, cover_image, published, slug: newSlug } = body;

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (newSlug !== undefined) { updates.push('slug = ?'); values.push(newSlug); }
    if (excerpt !== undefined) { updates.push('excerpt = ?'); values.push(excerpt); }
    if (content !== undefined) { updates.push('content = ?'); values.push(content); }
    if (cover_image !== undefined) { updates.push('cover_image = ?'); values.push(cover_image); }
    if (published !== undefined) { updates.push('published = ?'); values.push(published ? 1 : 0); }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(slug);

    const result = await env.DB.prepare(
      `UPDATE posts SET ${updates.join(', ')} WHERE slug = ?`
    ).bind(...values).run();

    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return new Response(JSON.stringify({ error: 'Failed to update post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { env, params, request } = context;
  const slug = params.slug as string;

  if (!await isAuthenticated(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  try {
    const result = await env.DB.prepare('DELETE FROM posts WHERE slug = ?').bind(slug).run();

    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
};
