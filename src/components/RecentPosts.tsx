import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../lib/api';
import BlogCard from './BlogCard';

export default function RecentPosts() {
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['posts', 'recent'],
    queryFn: () => fetchPosts({ limit: 3 }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <section className="mt-12 sm:mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-text mb-6">Recent Posts</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-neutral-border rounded w-24 mb-2" />
              <div className="h-6 bg-neutral-border rounded w-3/4 mb-2" />
              <div className="h-4 bg-neutral-border rounded w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError || !posts?.length) return null;

  return (
    <section className="mt-12 sm:mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-text">Recent Posts</h2>
        <Link to="/blog" className="font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider">
          View all →
        </Link>
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} compact />
        ))}
      </div>
    </section>
  );
}
