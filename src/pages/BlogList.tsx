import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../lib/api';
import BlogCard from '../components/BlogCard';

export default function BlogList() {
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  });

  return (
    <div className="min-h-screen bg-neutral-bg text-neutral-text selection:bg-white/20">
      <main className="max-w-2xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <header className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-text mb-4">Blog</h1>
          <p className="text-neutral-text-secondary">Thoughts on cybersecurity, development, and technology.</p>
        </header>

        {isLoading && (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse pb-6 border-b border-neutral-border">
                <div className="h-4 bg-neutral-border rounded w-24 mb-3" />
                <div className="h-7 bg-neutral-border rounded w-3/4 mb-3" />
                <div className="h-4 bg-neutral-border rounded w-full mb-2" />
                <div className="h-4 bg-neutral-border rounded w-2/3 mb-3" />
                <div className="h-4 bg-neutral-border rounded w-20" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-neutral-text-secondary mb-4">Failed to load posts</p>
            <button onClick={() => window.location.reload()} className="font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider">
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && !posts?.length && (
          <div className="text-center py-12">
            <p className="text-neutral-text-secondary">No posts yet. Check back soon!</p>
          </div>
        )}

        {posts?.length ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}
