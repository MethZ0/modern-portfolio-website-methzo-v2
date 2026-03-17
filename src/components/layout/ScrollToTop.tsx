import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10"
        >
          <Button
            size="icon"
            onClick={scrollToTop}
            className={cn(
              "size-12 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90",
              "border border-border/50 backdrop-blur transition-all duration-300",
              "hover:scale-110 active:scale-95"
            )}
            aria-label="Scroll to top"
          >
            <ArrowUp className="size-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
