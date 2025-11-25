export default function AboutSection() {
  return (
    <div className="space-y-16">
      <section>
        <p className="text-lg leading-relaxed text-neutral-text-secondary max-w-prose">
          I design and secure backend systems. Currently focused on building game 
          infrastructure and automating workflows while completing my degree in Cybersecurity.
        </p>
      </section>

      <section>
        <h2 className="font-mono text-xs font-medium text-neutral-text-tertiary uppercase tracking-widest mb-8">
          Active Roles
        </h2>
        
        <div className="space-y-10">
          <div className="group">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
              <h3 className="text-base font-medium text-neutral-text group-hover:text-white transition-colors">
                PCM Tech Officer
              </h3>
              <a
                href="https://www.instagram.com/clcboardsnbytes/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-neutral-text-tertiary hover:text-emerald-400 transition-colors"
              >
                @ Boards and Bytes ↗
              </a>
            </div>
            <p className="text-sm text-neutral-text-secondary leading-relaxed max-w-md group-hover:text-neutral-text transition-colors duration-300">
              Managing IT infrastructure and computer maintenance for the organization.
            </p>
          </div>

          <div className="group">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
              <h3 className="text-base font-medium text-neutral-text">
                Independent Researcher
              </h3>
              <span className="font-mono text-xs text-neutral-text-tertiary">
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