export default function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-4 text-sm">
      <a
        href="https://github.com/emmerichdev"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center leading-none text-retro-accent hover:text-retro-glow transition-colors duration-300"
        aria-label="GitHub"
      >
        [GITHUB]
      </a>
      <div className="w-px h-5 bg-retro-purple opacity-60" aria-hidden="true" role="separator" />
      <a
        href="https://www.linkedin.com/in/emmerichb/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center leading-none text-retro-accent hover:text-retro-glow transition-colors duration-300"
        aria-label="LinkedIn"
      >
        [LINKEDIN]
      </a>
      <div className="w-px h-5 bg-retro-purple opacity-60" aria-hidden="true" role="separator" />
      <a
        href="mailto:me@emmerichbrowne.com"
        className="inline-flex items-center leading-none text-retro-accent hover:text-retro-glow transition-colors duration-300"
        aria-label="Email"
      >
        [EMAIL]
      </a>
    </div>
  );
}