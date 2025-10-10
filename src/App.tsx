import SocialLinks from './components/SocialLinks';
import AboutSection from './components/AboutSection';

function App() {
  return (
    <div className="min-h-screen bg-retro-bg text-retro-light font-retro flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl w-full flex flex-col xl:flex-row gap-8 sm:gap-12 xl:gap-16 items-start">
          <header className="w-full xl:flex-1 text-center xl:text-left space-y-6 sm:space-y-8 xl:space-y-10">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-retro-glow glow-text leading-tight">
                Emmerich Browne
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl text-retro-purple font-medium">
                Backend Systems Developer
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-3 sm:gap-6 text-retro-light/70 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <span>Illinois, United States</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-retro-accent/50"></div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🎓</span>
                  <span>Undergraduate @ CLC • Computer Science</span>
                </div>
              </div>
            </div>

          </header>

          <div className="hidden xl:flex flex-col items-center justify-center px-4">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-retro-purple/40 to-transparent"></div>
          </div>

          <div className="xl:hidden flex items-center justify-center w-full px-4 sm:px-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-retro-purple/40 to-transparent"></div>
          </div>

          <AboutSection />
        </div>
      </main>
      <footer className="px-4 sm:px-6 md:px-8 py-6 border-t border-retro-accent/20 bg-retro-card/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-col sm:flex-row gap-4">
          <span className="text-retro-accent text-xs">© {new Date().getFullYear()} Emmerich Browne</span>
          <SocialLinks />
        </div>
      </footer>
    </div>
  )
}

export default App