import { useState, useCallback } from 'react';
import NavLinks from './components/NavLinks';
import SocialLinks from './components/SocialLinks';
import TypingText from './components/TypingText';

function AboutSection() {
  const [canRetype, setCanRetype] = useState(false);
  const [handleRetype, setHandleRetype] = useState<(() => void) | null>(null);

  const onRetypeReady = useCallback((retypeAvailable: boolean, retypeHandler: () => void) => {
    setCanRetype(retypeAvailable);
    setHandleRetype(() => retypeHandler);
  }, []);

  const handleBoxClick = useCallback(() => {
    if (canRetype && handleRetype) {
      handleRetype();
    }
  }, [canRetype, handleRetype]);

  return (
    <div className="w-full xl:flex-1 slide-up-animation mt-6 sm:mt-8 xl:mt-0">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-retro-glow mb-4 sm:mb-6 md:mb-8 text-center xl:text-left glow-text">
        [ABOUT.sh]
      </h2>
      <div 
        onClick={handleBoxClick}
        className={`bg-retro-card p-4 sm:p-6 md:p-8 border border-retro-accent shadow-neon hover:shadow-neon-strong transition-all duration-300 min-h-[120px] sm:min-h-[140px] max-w-2xl xl:max-w-none mx-auto xl:mx-0 ${canRetype ? 'cursor-pointer' : ''}`}
      >
        <TypingText 
          text="> Welcome. I'm a passionate backend systems developer with a love for AI and automation. I specialize in building scalable server side systems and intelligent solutions."
          className="text-base sm:text-lg leading-relaxed text-retro-light"
          onRetypeReady={onRetypeReady}
        />
      </div>
    </div>
  );
}

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