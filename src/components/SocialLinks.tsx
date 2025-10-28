export default function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-4 text-sm">
      <a
        href="https://github.com/emmerichdev"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center leading-none text-retro-accent hover:text-retro-purple transition-colors duration-300 font-medium"
        aria-label="GitHub"
      >
        GitHub
      </a>
      <div className="w-1 h-1 rounded-full bg-retro-accent/40" aria-hidden="true" role="separator" />
      <a
        href="https://www.linkedin.com/in/emmerichb/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center leading-none text-retro-accent hover:text-retro-purple transition-colors duration-300 font-medium"
        aria-label="LinkedIn"
      >
        LinkedIn
      </a>
      <div className="w-1 h-1 rounded-full bg-retro-accent/40" aria-hidden="true" role="separator" />
      <a
        href="mailto:me@emmerichbrowne.com"
        className="inline-flex items-center leading-none text-retro-accent hover:text-retro-purple transition-colors duration-300 font-medium"
        aria-label="Email"
      >
        Email
      </a>
    </div>
  );
}
