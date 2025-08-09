import { useState, useCallback } from 'react';
import TypingText from './TypingText';

export default function AboutSection() {
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
          className="text-base sm:text-lg leading-relaxed text-retro-light text-center xl:text-left"
          onRetypeReady={onRetypeReady}
        />
      </div>
    </div>
  );
}