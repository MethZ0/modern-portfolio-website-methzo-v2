import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const logoImg = '/Logo.png';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const overlayTopRef = useRef<HTMLDivElement>(null);
  const overlayBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoRef.current || !barRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance
      gsap.from(logoRef.current, {
        scale: 0.6,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      });

      gsap.to(barRef.current, {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut',
      });
    });

    // After loading duration, trigger exit
    const timer = setTimeout(() => {
      setIsExiting(true);
      triggerExit();
    }, 2200);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  const triggerExit = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        onComplete?.();
      },
    });

    // Scale up logo and fade it
    tl.to(logoRef.current, {
      scale: 12,
      opacity: 0,
      duration: 1,
      ease: 'power3.in',
    });

    // Hide progress bar simultaneously
    tl.to(barRef.current?.parentElement || {}, {
      opacity: 0,
      duration: 0.3,
    }, '-=1');

    // Split curtain reveal — starts AFTER logo is fully gone
    tl.to(overlayTopRef.current, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power4.inOut',
    });

    tl.to(overlayBottomRef.current, {
      yPercent: 100,
      duration: 0.7,
      ease: 'power4.inOut',
    }, '<');
  };

  if (!isLoading) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-auto">
      {/* Top curtain */}
      <div
        ref={overlayTopRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-background"
      />
      {/* Bottom curtain */}
      <div
        ref={overlayBottomRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-background"
      />

      {/* Centered content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex flex-col items-center gap-6">
          {/* Logo with color-flip */}
          <div ref={logoRef} className="relative h-16 w-16">
            <motion.img
              src={logoImg}
              alt="Loading"
              className="absolute inset-0 h-full w-full object-contain brightness-0 dark:invert"
              initial={{ opacity: 1 }}
              animate={{
                opacity: [1, 0, 1, 0, 1],
              }}
              transition={{
                duration: 2.2,
                times: [0, 0.25, 0.5, 0.75, 1],
                ease: 'easeInOut',
              }}
            />
            <motion.img
              src={logoImg}
              alt="Loading"
              className="absolute inset-0 h-full w-full object-contain brightness-0 invert dark:brightness-0 dark:[filter:none]"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0, 1, 0],
              }}
              transition={{
                duration: 2.2,
                times: [0, 0.25, 0.5, 0.75, 1],
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Progress bar */}
          <div className="w-24 h-[2px] bg-border rounded-full overflow-hidden">
            <div
              ref={barRef}
              className="h-full bg-foreground/40 rounded-full"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
