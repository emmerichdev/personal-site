export default function AboutSection() {
  return (
    <div className="w-full xl:flex-1 slide-up-animation mt-6 sm:mt-8 xl:mt-0">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-retro-glow mb-4 sm:mb-6 md:mb-8 text-center xl:text-left glow-text">
        [ABOUT.me]
      </h2>

      <div className="bg-retro-card border border-retro-accent shadow-neon hover:shadow-neon-strong transition-all duration-300 p-4 sm:p-6 max-w-2xl xl:max-w-none mx-auto xl:mx-0">
        <div className="space-y-4">
          <p className="text-retro-light/90 leading-relaxed text-center xl:text-left">
            Hello there, I'm a backend systems developer focusing on building scalable server-side systems and intelligent solutions.
          </p>

          <div className="space-y-3">
            <div className="text-center xl:text-left">
              <span className="text-retro-accent/80 text-sm font-medium">Education:</span>
              <span className="text-retro-light/70 text-sm ml-2">Undergraduate @ CLC | Comp Sci</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}