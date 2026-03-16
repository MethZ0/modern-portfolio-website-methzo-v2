import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { photographerInfo } from '@/data/photographer';
import { cn } from '@/lib/utils';

const logoImg = '/Logo.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function Header() {
  const location = useLocation();
  const { isScrolled } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
    >
      <div
        className={cn(
          'flex items-center justify-between w-full max-w-3xl px-5 py-2.5 rounded-full transition-all duration-500',
          isScrolled
            ? 'bg-background/60 backdrop-blur-2xl border border-border/40 shadow-lg shadow-background/10'
            : 'bg-foreground/5 backdrop-blur-xl border border-foreground/[0.06]'
        )}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center transition-opacity duration-300 hover:opacity-70"
        >
          <img
            src={logoImg}
            alt={photographerInfo.name}
            className="h-6 w-auto brightness-0 dark:invert opacity-90"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative px-3.5 py-1.5 text-[13px] font-body tracking-wide rounded-full transition-all duration-300',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 rounded-full bg-foreground/[0.08] dark:bg-foreground/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full"
                  aria-label="Open menu"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <nav className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'font-display text-2xl tracking-wide transition-colors',
                        location.pathname === link.path
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
