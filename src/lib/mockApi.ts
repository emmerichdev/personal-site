import type {
  CreatePostInput,
  FetchPostsOptions,
  Post,
  PostListItem,
  UpdatePostInput,
} from '../types';

const STORAGE_KEY = 'personal-site:mock-posts';

let memoryStore: Post[] | null = null;

const hasStorage = typeof window !== 'undefined' && 'localStorage' in window;

function loadFromStorage(): Post[] | null {
  if (!hasStorage) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Post[]) : null;
  } catch {
    return null;
  }
}

function persist(posts: Post[]): void {
  memoryStore = [...posts];
  if (!hasStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // ignore storage write errors
  }
}

function buildSeedPosts(): Post[] {
  const now = Date.now();
  const makeTimestamp = (offsetDays: number) =>
    new Date(now - offsetDays * 24 * 60 * 60 * 1000).toISOString();

  const firstTimestamp = makeTimestamp(3);
  const secondTimestamp = makeTimestamp(10);

  return [
    {
      id: 1,
      slug: 'launching-the-site',
      title: 'Launching the new site experience',
      excerpt: 'Behind-the-scenes details on the stack powering this personal site.',
      content:
        '<p>The production site is deployed to Cloudflare Pages with a D1 database and R2 storage. During development, you can work entirely offline thanks to the local mock API provided in this repository.</p><p>Use the admin area to create, edit, and delete posts. When you are ready to sync real data, disable local mode to hit the deployed API endpoints.</p>',
      cover_image: null,
      published: true,
      created_at: firstTimestamp,
      updated_at: firstTimestamp,
    },
    {
      id: 2,
      slug: 'roadmap-2025',
      title: '2025 roadmap and upcoming articles',
      excerpt: 'A quick look at the topics planned for the next few months.',
      content:
        '<p>This mock entry is here so you have something to look at while working locally. Add or edit posts from the admin section—everything is stored in your browser only.</p>',
      cover_image: null,
      published: false,
      created_at: secondTimestamp,
      updated_at: secondTimestamp,
    },
  ];
}

function getPosts(): Post[] {
  if (memoryStore) return [...memoryStore];

  const stored = loadFromStorage();
  if (stored?.length) {
    memoryStore = [...stored];
    return [...memoryStore];
  }

  const seeded = buildSeedPosts();
  persist(seeded);
  return [...seeded];
}

function nextId(posts: Post[]): number {
  return posts.reduce((max, post) => Math.max(max, post.id), 0) + 1;
}

function simulateLatency<T>(result: T, delay = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), delay));
}

export async function fetchPosts(options?: FetchPostsOptions): Promise<PostListItem[]> {
  const posts = getPosts();
  const includeUnpublished = options?.includeUnpublished ?? false;

  let filtered = includeUnpublished ? posts : posts.filter((post) => post.published);

  if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return simulateLatency(
    filtered.map((post) => {
      const { content, ...rest } = post;
      void content;
      return rest;
    }),
  );
}

export async function fetchPost(slug: string): Promise<Post> {
  const posts = getPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    throw new Error('Post not found');
  }
  return simulateLatency(post);
}

export async function createPost(post: CreatePostInput): Promise<number> {
  const posts = getPosts();
  const id = nextId(posts);
  const timestamp = new Date().toISOString();

  const newPost: Post = {
    id,
    ...post,
    excerpt: post.excerpt ?? null,
    cover_image: post.cover_image ?? null,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const next = [newPost, ...posts];
  persist(next);
  await simulateLatency(null);
  return id;
}

export async function updatePost({ slug, updates }: UpdatePostInput): Promise<void> {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) throw new Error('Post not found');

  const timestamp = new Date().toISOString();
  const updatedPost: Post = {
    ...posts[index],
    ...updates,
    excerpt: updates.excerpt ?? posts[index].excerpt,
    cover_image: updates.cover_image ?? posts[index].cover_image,
    updated_at: timestamp,
  };

  const next = [...posts];
  next[index] = updatedPost;
  persist(next);
  await simulateLatency(null);
}

export async function deletePost(slug: string): Promise<void> {
  const posts = getPosts();
  const next = posts.filter((post) => post.slug !== slug);
  if (next.length === posts.length) {
    throw new Error('Post not found');
  }
  persist(next);
  await simulateLatency(null);
}

export async function uploadFile(file: File): Promise<string> {
  if (typeof URL !== 'undefined') {
    return simulateLatency(URL.createObjectURL(file));
  }

  return simulateLatency(`data:${file.type};base64,`);
}

