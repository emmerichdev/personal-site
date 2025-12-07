import { Env, Post, isAuthenticated, corsHeaders } from '../shared';

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: corsHeaders() });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url);
  const limit = url.searchParams.get('limit');
  const includeUnpublished = url.searchParams.get('all') === 'true';

  try {
    let query = 'SELECT id, slug, title, excerpt, cover_image, published, created_at, updated_at FROM posts';
    const params: (string | number)[] = [];

    if (!includeUnpublished || !await isAuthenticated(request, env)) {
      query += ' WHERE published = 1';
    }

    query += ' ORDER BY created_at DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const { results } = await env.DB.prepare(query).bind(...params).all<Omit<Post, 'content'>>();

    const cacheControl = (!includeUnpublished && !limit) // Only cache full public list
      ? 'public, max-age=3600, stale-while-revalidate=86400'
      : 'private, no-cache';

    return new Response(JSON.stringify({ posts: results }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': cacheControl,
        ...corsHeaders()
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  if (!await isAuthenticated(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  try {
    const body = await request.json() as Partial<Post>;
    const { title, slug, excerpt, content, cover_image, published } = body;

    if (!title || !slug || !content) {
      return new Response(JSON.stringify({ error: 'Title, slug, and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    }

    const result = await env.DB.prepare(
      `INSERT INTO posts (title, slug, excerpt, content, cover_image, published) VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(title, slug, excerpt || null, content, cover_image || null, published ? 1 : 0).run();

    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  } catch (error: unknown) {
    console.error('Error creating post:', error);
    const message = error instanceof Error && error.message.includes('UNIQUE')
      ? 'A post with this slug already exists'
      : 'Failed to create post';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
};
