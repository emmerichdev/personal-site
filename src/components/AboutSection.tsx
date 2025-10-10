export default function AboutSection() {
  return (
    <div className="w-full xl:flex-1 slide-up-animation mt-6 sm:mt-8 xl:mt-0">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-retro-glow mb-6 sm:mb-8 text-center xl:text-left">
        About Me
      </h2>

      <div className="bg-retro-card border border-retro-accent/30 shadow-neon hover:shadow-neon-strong transition-all duration-300 rounded-xl p-6 sm:p-8 max-w-2xl xl:max-w-none mx-auto xl:mx-0">
        <div className="space-y-6">
          <p className="text-retro-light/90 leading-relaxed text-center xl:text-left text-base sm:text-lg">
            Hello there, I'm a backend systems developer working on getting my Associates degree in Computer Science!
          </p>

          <div className="pt-4 border-t border-retro-accent/20">
            <div className="text-center xl:text-left">
              <span className="text-retro-purple font-semibold text-sm">Current Work</span>
              <div className="mt-3 space-y-3">
                <div className="text-retro-light/80 text-sm">
                  <div className="flex items-start gap-2 justify-center xl:justify-start">
                    <span className="text-retro-purple mt-0.5">•</span>
                    <div>
                      <span className="font-medium">PCM Tech Officer</span>
                      <span className="text-retro-light/60"> @ </span>
                      <a 
                        href="https://www.instagram.com/clcboardsnbytes/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-retro-purple hover:text-retro-glow transition-colors duration-300 font-medium"
                      >
                        Boards and Bytes
                      </a>
                      <span className="text-retro-light/60">, CLC</span>
                      <p className="text-retro-light/60 text-xs mt-1">Computer maintenance and IT infrastructure management</p>
                    </div>
                  </div>
                </div>
                <div className="text-retro-light/80 text-sm">
                  <div className="flex items-start gap-2 justify-center xl:justify-start">
                    <span className="text-retro-purple mt-0.5">•</span>
                    <div>
                      <span className="font-medium">Developer</span>
                      <span className="text-retro-light/60"> @ </span>
                      <a 
                        href="https://norisk.gg/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-retro-purple hover:text-retro-glow transition-colors duration-300 font-medium"
                      >
                        NoRiskClient
                      </a>
                      <p className="text-retro-light/60 text-xs mt-1">Client-side software development</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}