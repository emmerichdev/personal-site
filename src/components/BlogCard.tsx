import { Link } from 'react-router-dom';
import type { PostListItem } from '../types';
import { formatDate } from '../lib/utils';

interface BlogCardProps {
  post: PostListItem;
  compact?: boolean;
}

export default function BlogCard({ post, compact = false }: BlogCardProps) {
  return (
    <article className={`group ${compact ? '' : 'pb-6 border-b border-neutral-border last:border-0'}`}>
      <Link to={`/blog/${post.slug}`} className="block">
        {post.cover_image && !compact && (
          <div className="mb-4 overflow-hidden rounded-lg aspect-video bg-neutral-border/50">
            <img src={post.cover_image} alt={post.title} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <time className="font-mono text-xs text-neutral-text-tertiary uppercase tracking-wider">{formatDate(post.created_at)}</time>
            {!post.published && <span className="font-mono text-xs text-amber-400 uppercase tracking-wider">Draft</span>}
          </div>
          
          <h3 className={`font-semibold tracking-tight text-neutral-text group-hover:text-neutral-text-secondary transition-colors ${compact ? 'text-base' : 'text-xl'}`}>
            {post.title}
          </h3>
          
          {post.excerpt && !compact && (
            <p className="text-neutral-text-secondary text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
          )}
          
          <span className="inline-flex items-center gap-1 text-sm text-neutral-text-secondary group-hover:text-neutral-text transition-colors">
            Read more
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
