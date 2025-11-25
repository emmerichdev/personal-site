export default function SocialLinks() {
  const links = [
    { name: 'GitHub', url: 'https://github.com/emmerichdev' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/emmerichb/' },
    { name: 'Email', url: 'mailto:me@emmerichbrowne.com' },
  ];

  return (
    <div className="flex items-center gap-6">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-neutral-text-tertiary hover:text-white transition-colors uppercase tracking-wider"
        >
          {link.name}
        </a>
      ))}
    </div>
  );
}