import NavLinks from './components/NavLinks';
import SocialLinks from './components/SocialLinks';
import AboutSection from './components/AboutSection';

function App() {
  return (
    <div className="min-h-screen bg-retro-bg text-retro-light font-retro flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl w-full flex flex-col xl:flex-row gap-8 sm:gap-12 xl:gap-16 items-start">
          <header className="w-full xl:flex-1 text-center xl:text-left space-y-6 sm:space-y-8 xl:space-y-10 float-animation">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-retro-glow glow-text leading-tight whitespace-nowrap">
                [EMMERICH BROWNE]
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl text-retro-accent typing-animation">
                &gt; Backend Systems Developer_
              </h2>
              <div className="flex items-center justify-center xl:justify-start text-retro-light/80 text-sm">
                <span className="font-mono text-xs mr-2">📍</span>
                <span>Illinois, United States (CST)</span>
              </div>
              <div className="flex items-center justify-center xl:justify-start text-retro-light/80 text-xs">
                <span className="font-mono text-xs mr-2">🔄</span>
                <span>Open to opportunities</span>
              </div>
            </div>

            <div className="flex items-center justify-center xl:justify-start space-x-2 text-retro-purple">
              <div className="flex-1 h-px bg-retro-purple max-w-16 sm:max-w-24"></div>
              <span className="text-xs font-mono">&gt;&gt;&gt;</span>
              <div className="flex-1 h-px bg-retro-purple max-w-16 sm:max-w-24"></div>
            </div>
            
            <div className="space-y-4">
              <NavLinks />
            </div>
          </header>

          <div className="hidden xl:flex flex-col items-center justify-center px-4">
            <div className="w-px h-16 bg-retro-purple"></div>
            <div className="text-retro-purple text-xs font-mono my-2 rotate-90">&gt;&gt;&gt;</div>
            <div className="w-px h-16 bg-retro-purple"></div>
          </div>

          <div className="xl:hidden flex items-center justify-center space-x-2 text-retro-purple w-full px-4 sm:px-8">
            <div className="flex-1 h-px bg-retro-purple max-w-16 sm:max-w-24"></div>
            <span className="text-xs font-mono">&gt;&gt;&gt;</span>
            <div className="flex-1 h-px bg-retro-purple max-w-16 sm:max-w-24"></div>
          </div>

          <AboutSection />
        </div>
      </main>
      <footer className="px-4 sm:px-6 md:px-8 py-6 border-t border-retro-accent/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-col sm:flex-row gap-3">
          <span className="text-retro-purple text-xs opacity-70">© {new Date().getFullYear()} Emmerich Browne</span>
          <SocialLinks />
        </div>
      </footer>
    </div>
  )
}

export default App