import { Link } from 'react-router-dom';

export function NavLinks() {
  return (
    <div className="flex justify-center xl:justify-start">
      <Link
        to="/projects"
        className="text-retro-accent hover:text-retro-glow transition-colors duration-300 text-base sm:text-lg font-bold"
      >
        [PROJECTS]
      </Link>
    </div>
  );
}

export default NavLinks;