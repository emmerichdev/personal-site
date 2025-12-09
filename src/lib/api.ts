import type { Post, PostListItem, CreatePostInput, UpdatePostInput, FetchPostsOptions } from '../types';
import { apiBaseUrl, isLocalMode } from './config';
import * as mockApi from './mockApi';

const API_BASE = apiBaseUrl;

export async function fetchPosts(options?: FetchPostsOptions): Promise<PostListItem[]> {
  if (isLocalMode) {
    return mockApi.fetchPosts(options);
  }

  const params = new URLSearchParams();
  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.includeUnpublished) params.set('all', 'true');
  
  const response = await fetch(`${API_BASE}/posts?${params}`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  
  const data = await response.json();
  return data.posts;
}

export async function fetchPost(slug: string): Promise<Post> {
  if (isLocalMode) {
    return mockApi.fetchPost(slug);
  }

  const response = await fetch(`${API_BASE}/posts/${slug}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Post not found');
    throw new Error('Failed to fetch post');
  }
  
  const data = await response.json();
  return data.post;
}

export async function createPost(post: CreatePostInput): Promise<number> {
  if (isLocalMode) {
    return mockApi.createPost(post);
  }

  const response = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to create post');
  }
  
  const data = await response.json();
  return data.id;
}

export async function updatePost({ slug, updates }: UpdatePostInput): Promise<void> {
  if (isLocalMode) {
    return mockApi.updatePost({ slug, updates });
  }

  const response = await fetch(`${API_BASE}/posts/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update post');
  }
}

export async function deletePost(slug: string): Promise<void> {
  if (isLocalMode) {
    return mockApi.deletePost(slug);
  }

  const response = await fetch(`${API_BASE}/posts/${slug}`, { method: 'DELETE' });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete post');
  }
}

export async function uploadFile(file: File): Promise<string> {
  if (isLocalMode) {
    return mockApi.uploadFile(file);
  }

  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to upload file');
  }
  
  const data = await response.json();
  return data.url;
}
