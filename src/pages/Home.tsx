import { Link } from 'react-router-dom';
import SocialLinks from '../components/SocialLinks';
import AboutSection from '../components/AboutSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-bg text-neutral-text selection:bg-white/20">
      <main className="max-w-2xl mx-auto px-6 sm:px-8 py-20 sm:py-24">

        <header className="mb-12 sm:mb-16">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-text">
              Emmerich Browne
            </h1>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs text-neutral-text-secondary hover:text-neutral-text transition-colors uppercase tracking-wider"
            >
              Blog
              <svg className="w-4 h-4 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-neutral-text-secondary mb-6">
            <p className="text-lg tracking-tight font-light">
              Cybersecurity Student <span className="text-neutral-text-tertiary px-1">/</span> Backend Developer
            </p>
          </div>

        </header>

        <AboutSection />

        <footer className="mt-12 sm:mt-16 pt-8 border-t border-neutral-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <SocialLinks />
            <span className="font-mono text-xs text-neutral-text-secondary">
              © {new Date().getFullYear()} Emmerich Browne
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
