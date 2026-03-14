import { Link, useLocation } from 'react-router-dom';
import { Linkedin, Github, ArrowUpRight, Mail } from 'lucide-react';
import { photographerInfo } from '@/data/photographer';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        {/* Top — big CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="space-y-2">
            <p className="text-xs font-body tracking-[0.25em] uppercase text-muted-foreground">
              {photographerInfo.availability}
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl italic tracking-wide">
              Let's connect
            </h2>
          </div>
          <a
            href={`mailto:${photographerInfo.email}`}
            className="group inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="size-4" />
            {photographerInfo.email}
            <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Middle — nav + socials */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 py-8 border-t border-border">
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-body transition-colors ${
                  location.pathname === link.path
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {photographerInfo.socialLinks.github && (
              <a
                href={photographerInfo.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="size-4" />
              </a>
            )}
            {photographerInfo.socialLinks.linkedin && (
              <a
                href={photographerInfo.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-4" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom — copyright */}
        <div className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground font-body tracking-wide">
            © {currentYear} {photographerInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
