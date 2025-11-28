import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { fetchPost } from '../lib/api';
import { formatDate } from '../lib/utils';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPost(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-bg text-neutral-text">
        <main className="max-w-2xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
          <div className="animate-pulse">
            <div className="h-4 bg-neutral-border rounded w-24 mb-8" />
            <div className="h-4 bg-neutral-border rounded w-32 mb-4" />
            <div className="h-10 bg-neutral-border rounded w-3/4 mb-8" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-neutral-border rounded w-full" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-neutral-bg text-neutral-text">
        <main className="max-w-2xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
          <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to blog
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-text mb-4">Post not found</h1>
            <p className="text-neutral-text-secondary">The post you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg text-neutral-text selection:bg-white/20">
      <main className="max-w-2xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider mb-8">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <time className="font-mono text-xs text-neutral-text-tertiary uppercase tracking-wider">{formatDate(post.created_at)}</time>
              {!post.published && <span className="font-mono text-xs text-amber-400 uppercase tracking-wider">Draft</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-text mb-4">{post.title}</h1>
            {post.excerpt && <p className="text-lg text-neutral-text-secondary leading-relaxed">{post.excerpt}</p>}
          </header>

          {post.cover_image && (
            <div className="mb-8 overflow-hidden rounded-lg border border-neutral-border bg-neutral-border/50">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full h-auto max-h-[28rem] object-contain bg-neutral-border/40"
              />
            </div>
          )}

          <div 
            className="prose prose-invert prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-neutral-text-secondary prose-p:leading-relaxed prose-a:text-neutral-text prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-neutral-text-secondary prose-strong:text-neutral-text prose-strong:font-semibold prose-code:text-neutral-text prose-code:bg-neutral-border/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-neutral-border/30 prose-pre:border prose-pre:border-neutral-border prose-blockquote:border-neutral-border prose-blockquote:text-neutral-text-secondary prose-ul:text-neutral-text-secondary prose-ol:text-neutral-text-secondary prose-li:marker:text-neutral-text-tertiary prose-img:rounded-lg prose-img:w-full prose-img:h-auto prose-img:max-h-[28rem] prose-img:object-contain prose-img:bg-neutral-border/40 prose-img:border prose-img:border-neutral-border prose-img:p-3 prose-img:mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

      </main>
    </div>
  );
}
