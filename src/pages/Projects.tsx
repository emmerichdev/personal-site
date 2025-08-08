import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from '../components/SocialLinks';

type Repo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  visibility?: string;
};

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchRepos() {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://api.github.com/users/emmerichdev/repos?sort=updated&per_page=100',
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Failed to load repositories (${response.status})`);
        }
        const data: Repo[] = await response.json();
        if (!isMounted) return;
        setRepos(data);
      } catch (err) {
        if (!isMounted) return;
        if ((err as any)?.name === 'AbortError') return;
        setError((err as Error).message ?? 'Unexpected error');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchRepos();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const visibleRepos = useMemo(() => {
    return repos
      .filter((r) => !r.fork && !r.archived && !r.disabled)
      .filter((r) => r.name.toLowerCase() !== 'emmerichdev')
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [repos]);

  return (
    <div className="min-h-screen bg-retro-bg text-retro-light font-retro flex flex-col">
      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        <div className="max-w-7xl mx-auto w-full">
          <header className="mb-8 sm:mb-10 md:mb-12 slide-up-animation">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-retro-glow glow-text">[PROJECTS.sh]</h1>
              <Link
                to="/"
                className="text-retro-accent hover:text-retro-glow transition-all duration-300 hover:scale-110 text-sm sm:text-base font-bold py-2 px-2"
              >
                [HOME]
              </Link>
            </div>
            <p className="text-retro-purple mt-2 text-sm opacity-70">Open source repositories from GitHub</p>
            <div className="flex items-center space-x-2 text-retro-purple mt-4">
              <div className="flex-1 h-px bg-retro-purple max-w-24"></div>
              <span className="text-xs font-mono">&gt;&gt;&gt;</span>
              <div className="flex-1 h-px bg-retro-purple max-w-24"></div>
            </div>
          </header>

          {isLoading && (
            <p className="text-retro-accent">Loading repositories...</p>
          )}

          {error && (
            <p className="text-red-400">{error}</p>
          )}

          {!isLoading && !error && (
            <ul className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {visibleRepos.map((repo) => (
                <li key={repo.id}>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-retro-card border border-retro-accent shadow-neon hover:shadow-neon-strong transition-all duration-300 p-4 sm:p-5 md:p-6 group h-[180px] sm:h-[200px] lg:h-[220px] overflow-hidden"
                  >
                    <div className="flex h-full flex-col">
                      <div className="text-retro-accent group-hover:text-retro-glow text-lg font-bold">
                        {repo.name}
                      </div>
                      {repo.description && (
                        <p className="mt-2 text-sm text-retro-light/80 clamp-3">{repo.description}</p>
                      )}
                      <div className="mt-auto pt-3 flex items-center flex-wrap gap-3 text-xs text-retro-accent/90">
                        {repo.language && (
                          <span className="px-2 py-1 bg-retro-dark/60 border border-retro-accent/40">{repo.language}</span>
                        )}
                        <span className="px-2 py-1 bg-retro-dark/60 border border-retro-accent/40">★ {repo.stargazers_count}</span>
                        <span className="px-2 py-1 bg-retro-dark/60 border border-retro-accent/40">⑂ {repo.forks_count}</span>
                        <span className="ml-auto text-retro-purple opacity-70">Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <footer className="px-4 sm:px-6 md:px-8 py-6 border-t border-retro-accent/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-col sm:flex-row gap-3">
          <span className="text-retro-purple text-xs opacity-70">© {new Date().getFullYear()} Emmerich Browne</span>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}


