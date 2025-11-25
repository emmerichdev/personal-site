import SocialLinks from './components/SocialLinks';
import AboutSection from './components/AboutSection';

function App() {
  return (
    <div className="min-h-screen bg-neutral-bg text-neutral-text selection:bg-white/20">
      <main className="max-w-2xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        
        <header className="mb-16 sm:mb-20">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-text mb-4">
            Emmerich Browne
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-neutral-text-secondary mb-6">
            <p className="text-lg tracking-tight font-light">
              Cybersecurity Student <span className="text-neutral-text-tertiary px-1">/</span> Backend Developer
            </p>
          </div>

          <div className="font-mono text-xs text-neutral-text-secondary uppercase tracking-wider space-y-1 border-l border-neutral-border pl-4">
            <div className="hover:text-neutral-text transition-colors">Based in Illinois, US</div>
            <div className="hover:text-neutral-text transition-colors">Undergraduate @ CLC</div>
            <div>
              Status: <span className="text-emerald-400 animate-pulse">●</span> Active
            </div>
          </div>
        </header>

        <AboutSection />

        <footer className="mt-24 pt-8 border-t border-neutral-border">
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

export default App;