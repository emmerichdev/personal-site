import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, fetchPost, createPost, updatePost, deletePost, uploadFile } from '../lib/api';
import { generateSlug } from '../lib/utils';

type View = 'list' | 'edit' | 'create';

export default function Admin() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<View>('list');
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    published: false,
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: auth, isLoading: authLoading, isFetching: authFetching } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      return res.json() as Promise<{ authenticated: boolean }>;
    },
    staleTime: 0,
    gcTime: 0,
  });

  const { data: posts = [], isLoading: postsLoading, error } = useQuery({
    queryKey: ['posts', 'admin'],
    queryFn: () => fetchPosts({ includeUnpublished: true }),
    enabled: view === 'list' && !!auth?.authenticated,
    staleTime: 0,
    gcTime: 0,
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setSuccess('Post created successfully!');
      setView('list');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setSuccess('Post updated successfully!');
      setView('list');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setSuccess('Post deleted successfully!');
    },
  });

  if (authLoading || authFetching) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-bg text-neutral-text-secondary">Verifying session...</div>;
  }

  if (!auth?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg text-neutral-text">
        <div className="text-center">
          <a href="/api/auth/login" className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-border rounded-lg bg-transparent text-neutral-text hover:bg-neutral-surface transition-colors font-medium">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    );
  }

  const isLoading = postsLoading;

  async function handleEdit(slug: string) {
    const post = await fetchPost(slug);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      cover_image: post.cover_image || '',
      published: post.published,
    });
    setEditingSlug(slug);
    setView('edit');
  }

  function handleCreate() {
    setFormData({ title: '', slug: '', excerpt: '', content: '', cover_image: '', published: false });
    setEditingSlug(null);
    setView('create');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (view === 'create') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ slug: editingSlug!, updates: formData });
    }
  }

  function handleDelete(slug: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(slug);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setFormData({ ...formData, cover_image: url });
    } finally {
      setUploading(false);
    }
  }

  function handleTitleChange(title: string) {
    setFormData({
      ...formData,
      title,
      slug: view === 'create' ? generateSlug(title) : formData.slug,
    });
  }

  async function handleLogout() {
    queryClient.clear();
    localStorage.removeItem('blog-cache');
    window.location.replace('/api/auth/logout');
  }

  const mutationError = createMutation.error || updateMutation.error || deleteMutation.error;
  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  if (view === 'edit' || view === 'create') {
    return (
      <div className="min-h-screen bg-neutral-bg text-neutral-text">
        <main className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setView('list')} className="inline-flex items-center gap-2 font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to posts
            </button>
            <h1 className="text-xl font-semibold tracking-tight">{view === 'create' ? 'New Post' : 'Edit Post'}</h1>
          </div>

          {mutationError && <div className="mb-6 p-4 bg-red-400/10 border border-red-400/30 rounded-lg text-red-400">{(mutationError as Error).message}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-xs text-neutral-text-secondary uppercase tracking-wider mb-2">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full px-4 py-3 bg-neutral-border/30 border border-neutral-border rounded-lg focus:outline-none focus:border-neutral-text-secondary transition-colors" required />
              </div>
              <div>
                <label className="block font-mono text-xs text-neutral-text-secondary uppercase tracking-wider mb-2">Slug *</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-3 bg-neutral-border/30 border border-neutral-border rounded-lg focus:outline-none focus:border-neutral-text-secondary transition-colors font-mono text-sm" required />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-neutral-text-secondary uppercase tracking-wider mb-2">Excerpt</label>
              <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="w-full px-4 py-3 bg-neutral-border/30 border border-neutral-border rounded-lg focus:outline-none focus:border-neutral-text-secondary transition-colors resize-none" />
            </div>

            <div>
              <label className="block font-mono text-xs text-neutral-text-secondary uppercase tracking-wider mb-2">Cover Image</label>
              <div className="flex gap-4 items-start">
                <input type="text" value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} placeholder="Image URL or upload" className="flex-1 px-4 py-3 bg-neutral-border/30 border border-neutral-border rounded-lg focus:outline-none focus:border-neutral-text-secondary transition-colors" />
                <label className="px-4 py-3 bg-neutral-border/50 border border-neutral-border rounded-lg cursor-pointer hover:bg-neutral-border transition-colors">
                  <span className="font-mono text-xs uppercase tracking-wider">{uploading ? 'Uploading...' : 'Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
              {formData.cover_image && (
                <div className="mt-4 overflow-hidden rounded-lg border border-neutral-border bg-neutral-border/50">
                  <img src={formData.cover_image} alt="Cover preview" className="w-full h-auto max-h-64 object-contain bg-neutral-border/40" />
                </div>
              )}
            </div>

            <div>
              <label className="block font-mono text-xs text-neutral-text-secondary uppercase tracking-wider mb-2">Content * (HTML supported)</label>
              <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={15} className="w-full px-4 py-3 bg-neutral-border/30 border border-neutral-border rounded-lg focus:outline-none focus:border-neutral-text-secondary transition-colors resize-y font-mono text-sm" required />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4 rounded border-neutral-border bg-neutral-border/30 text-neutral-text focus:ring-0 focus:ring-offset-0" />
              <label htmlFor="published" className="text-sm text-neutral-text-secondary">Published</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={isMutating} className="px-6 py-3 bg-neutral-text text-neutral-bg font-medium rounded-lg hover:bg-neutral-text-secondary transition-colors disabled:opacity-50">
                {isMutating ? 'Saving...' : view === 'create' ? 'Create Post' : 'Update Post'}
              </button>
              <button type="button" onClick={() => setView('list')} className="px-6 py-3 border border-neutral-border rounded-lg hover:bg-neutral-border/30 transition-colors">Cancel</button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg text-neutral-text">
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Blog Admin</h1>
            <Link to="/" className="font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider">← Back to site</Link>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleCreate} className="px-4 py-2 bg-neutral-text text-neutral-bg font-medium rounded-lg hover:bg-neutral-text-secondary transition-colors">New Post</button>
            <button onClick={handleLogout} className="px-4 py-2 border border-neutral-border rounded-lg hover:bg-neutral-border/30 transition-colors font-mono text-xs uppercase tracking-wider">Logout</button>
          </div>
        </header>

        {(error || mutationError) && <div className="mb-6 p-4 bg-red-400/10 border border-red-400/30 rounded-lg text-red-400">{((error || mutationError) as Error).message}</div>}
        {success && <div className="mb-6 p-4 bg-emerald-400/10 border border-emerald-400/30 rounded-lg text-emerald-400">{success}</div>}

        {isLoading && <div className="text-center py-12 text-neutral-text-secondary">Loading posts...</div>}

        {!isLoading && !posts.length && (
          <div className="text-center py-12">
            <p className="text-neutral-text-secondary mb-4">No posts yet</p>
            <button onClick={handleCreate} className="font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider">Create your first post</button>
          </div>
        )}

        {posts.length > 0 && (
          <div className="border border-neutral-border rounded-lg divide-y divide-neutral-border">
            {posts.map((post) => (
              <div key={post.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    {!post.published && <span className="font-mono text-xs text-amber-400 uppercase tracking-wider shrink-0">Draft</span>}
                  </div>
                  <p className="font-mono text-xs text-neutral-text-tertiary">/{post.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/blog/${post.slug}`} className="px-3 py-1.5 font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider">View</Link>
                  <button onClick={() => handleEdit(post.slug)} className="px-3 py-1.5 font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider">Edit</button>
                  <button onClick={() => handleDelete(post.slug)} className="px-3 py-1.5 font-mono text-xs text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
