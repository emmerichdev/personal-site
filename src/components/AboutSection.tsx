export default function AboutSection() {
  return (
    <div>
      <section className="mb-12 sm:mb-16">
        <p className="text-lg leading-relaxed text-neutral-text-secondary max-w-prose">
          I design and secure backend systems. Currently focused on building game 
          infrastructure and automating workflows while completing my degree in Cybersecurity.
        </p>
      </section>

      <section className="mb-12 sm:mb-16">
        <h2 className="font-mono text-xs font-medium text-neutral-text-secondary uppercase tracking-widest mb-8">
          Active Roles
        </h2>
        
        <div className="space-y-10">
          <div className="group">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
              <h3 className="text-base font-medium text-neutral-text group-hover:text-white transition-colors">
                Software Engineer
              </h3>
              <a
                href="https://hylandia.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-neutral-text-secondary hover:text-emerald-400 transition-colors"
              >
                @ Hylandia ↗
              </a>
            </div>
            <p className="text-sm text-neutral-text-secondary leading-relaxed max-w-md group-hover:text-neutral-text transition-colors duration-300">
              Building and managing backend infrastructure for the network, as well as developing mods and plugins for the game <a href="https://hytale.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-400 transition-colors">Hytale</a>.
            </p>
          </div>

          <div className="group">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
              <h3 className="text-base font-medium text-neutral-text">
                Independent Researcher
              </h3>
              <span className="font-mono text-xs text-neutral-text-secondary">
                Self-Directed
              </span>
            </div>
            <p className="text-sm text-neutral-text-secondary leading-relaxed max-w-md group-hover:text-neutral-text transition-colors duration-300">
              Developing automation scripts and analyzing backend vulnerabilities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}