import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Palette, Code } from 'lucide-react';

const profileReal = '/profile.jpg';
const profileCartoon = '/profile-cartoon.jpg';

export function SplitHero() {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.split-left', {
        x: '-100%',
        duration: 1.2,
        ease: 'power4.out',
      });
      gsap.from('.split-right', {
        x: '100%',
        duration: 1.2,
        ease: 'power4.out',
      });
      gsap.from(dividerRef.current, {
        scaleY: 0,
        duration: 0.8,
        delay: 0.8,
        ease: 'power3.out',
      });
      gsap.from('.hero-name', {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 1,
        ease: 'power3.out',
      });
      gsap.from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 1.3,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (side: 'left' | 'right') => {
    if (side === 'left') {
      navigate('/portfolio?filter=design');
    } else {
      navigate('/portfolio?filter=development');
    }
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden select-none">
      {/* Left Side - Cartoon / UI/UX */}
      <div
        className="split-left absolute top-0 left-0 h-full cursor-pointer overflow-hidden transition-all duration-700 ease-out"
        style={{ width: hoveredSide === 'left' ? '60%' : hoveredSide === 'right' ? '40%' : '50%' }}
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={() => handleClick('left')}
      >
        {/* Cartoon image */}
        <img
          src={profileCartoon}
          alt="Methush Anjula - Creative Side"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700"
          style={{ 
            transform: hoveredSide === 'left' ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-foreground/20" />

        {/* Content */}
        <div className="absolute inset-0 z-30 flex flex-col justify-end items-start p-8 md:p-14">
          <AnimatePresence>
            {(hoveredSide === 'left' || hoveredSide === null) && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                    <Palette className="size-4 text-primary-foreground" />
                  </div>
                  <span className="text-primary-foreground/70 text-xs font-body tracking-[0.2em] uppercase">
                    Creative
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl text-primary-foreground tracking-wide">
                  UI/UX Design
                </h2>
                <p className="text-primary-foreground/50 text-sm font-body max-w-xs leading-relaxed">
                  Figma · Adobe XD · Responsive Design
                </p>
                <motion.div
                  className="flex items-center gap-2 text-primary-foreground/40 text-xs font-body"
                  animate={{ x: hoveredSide === 'left' ? [0, 4, 0] : 0 }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                >
                  <span>Explore →</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Side - Real Photo / Development */}
      <div
        className="split-right absolute top-0 right-0 h-full cursor-pointer overflow-hidden transition-all duration-700 ease-out"
        style={{ width: hoveredSide === 'right' ? '60%' : hoveredSide === 'left' ? '40%' : '50%' }}
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={() => handleClick('right')}
      >
        {/* Real photo */}
        <img
          src={profileReal}
          alt="Methush Anjula - Developer Side"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700"
          style={{ 
            transform: hoveredSide === 'right' ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-foreground/20" />

        {/* Content */}
        <div className="absolute inset-0 z-30 flex flex-col justify-end items-end p-8 md:p-14 text-right">
          <AnimatePresence>
            {(hoveredSide === 'right' || hoveredSide === null) && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2.5 justify-end">
                  <span className="text-primary-foreground/70 text-xs font-body tracking-[0.2em] uppercase">
                    Technical
                  </span>
                  <div className="p-1.5 rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                    <Code className="size-4 text-primary-foreground" />
                  </div>
                </div>
                <h2 className="font-display text-3xl md:text-5xl text-primary-foreground tracking-wide">
                  Development
                </h2>
                <p className="text-primary-foreground/50 text-sm font-body max-w-xs leading-relaxed ml-auto">
                  React · Node.js · TypeScript
                </p>
                <motion.div
                  className="flex items-center gap-2 text-primary-foreground/40 text-xs font-body justify-end"
                  animate={{ x: hoveredSide === 'right' ? [0, -4, 0] : 0 }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                >
                  <span>← Explore</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center Divider */}
      <div
        ref={dividerRef}
        className="absolute top-0 z-40 h-full w-px bg-primary-foreground/20 transition-all duration-700 ease-out pointer-events-none"
        style={{ left: hoveredSide === 'left' ? '60%' : hoveredSide === 'right' ? '40%' : '50%' }}
      />

      {/* Center Name Overlay */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="hero-name font-display text-5xl md:text-7xl lg:text-8xl tracking-wide text-primary-foreground drop-shadow-lg text-center italic">
          Methush
          <br />
          <span className="not-italic">Anjula</span>
        </h1>
        <p className="hero-subtitle mt-4 text-sm md:text-base font-body tracking-[0.3em] uppercase text-primary-foreground/50">
          Designer & Developer
        </p>
      </div>

      {/* Bottom gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-50 pointer-events-none" />
    </section>
  );
}
