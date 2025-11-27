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

export type PostListItem = Omit<Post, 'content'>;

export type CreatePostInput = Omit<Post, 'id' | 'created_at' | 'updated_at'>;

export interface UpdatePostInput {
  slug: string;
  updates: Partial<Post>;
}

export interface FetchPostsOptions {
  limit?: number;
  includeUnpublished?: boolean;
}

