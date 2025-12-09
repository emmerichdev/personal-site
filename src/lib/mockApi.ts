import type {
  CreatePostInput,
  FetchPostsOptions,
  Post,
  PostListItem,
  UpdatePostInput,
} from '../types';

export const MOCK_POSTS_STORAGE_KEY = 'personal-site:mock-posts';

let memoryStore: Post[] | null = null;

const hasStorage = typeof window !== 'undefined' && 'localStorage' in window;

function loadFromStorage(): Post[] | null {
  if (!hasStorage) return null;
  try {
    const raw = window.localStorage.getItem(MOCK_POSTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Post[]) : null;
  } catch {
    return null;
  }
}

function persist(posts: Post[]): void {
  memoryStore = [...posts];
  if (!hasStorage) return;
  try {
    window.localStorage.setItem(MOCK_POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // ignore storage write errors
  }
}

function getPosts(): Post[] {
  if (!memoryStore) {
    const stored = loadFromStorage();
    memoryStore = stored ? [...stored] : [];
  }

  return [...memoryStore];
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
    excerpt: updates.excerpt === undefined ? posts[index].excerpt : updates.excerpt,
    cover_image: updates.cover_image === undefined ? posts[index].cover_image : updates.cover_image,
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

