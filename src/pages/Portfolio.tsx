import { useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { mapDbProject } from '@/lib/mappers';
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { DesignShowcase } from '@/components/portfolio/DesignShowcase';
import { SEOHead } from '@/components/seo/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const designCategories = ['ui-ux', 'design'];
const devCategories = ['web-app', 'mobile-app', 'fullstack', 'api', 'open-source'];

const filters = [
  { value: 'all', label: 'All' },
  { value: 'design', label: 'Creative' },
  { value: 'development', label: 'Development' },
];

export default function Portfolio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';
  const heroRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  const { data: dbProjects, isLoading } = useProjects();
  const allProjects = useMemo(() => (dbProjects || []).map(mapDbProject), [dbProjects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'design') return allProjects.filter(p => designCategories.includes(p.category));
    if (activeFilter === 'development') return allProjects.filter(p => devCategories.includes(p.category));
    return allProjects;
  }, [activeFilter, allProjects]);

  const isDesignView = activeFilter === 'design';

  const handleFilter = (value: string) => {
    if (value === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ filter: value });
    }
  };

  const headingText = activeFilter === 'design'
    ? 'Creative Works'
    : activeFilter === 'development'
    ? 'Development'
    : 'All Projects';

  const subtitleText = activeFilter === 'design'
    ? 'UI/UX design, visual identities, and digital experiences'
    : activeFilter === 'development'
    ? 'Web apps, APIs, and full-stack engineering'
    : 'A curated collection of software projects and applications';

  // Animate project count
  useEffect(() => {
    if (countRef.current) {
      gsap.fromTo(countRef.current, 
        { textContent: '0' },
        { 
          textContent: filteredProjects.length,
          duration: 0.8,
          ease: 'power2.out',
          snap: { textContent: 1 },
        }
      );
    }
  }, [filteredProjects.length]);

  return (
    <>
      <SEOHead 
        title="Portfolio"
        description="Browse my complete project portfolio featuring UI/UX design, web apps, mobile apps, and full-stack applications."
      />
      
      <div className="min-h-screen">
        {/* Hero */}
        <section ref={heroRef} className="relative pt-32 pb-12 md:pt-40 md:pb-16 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Top row: filter pills + count */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => handleFilter(f.value)}
                    className={`
                      px-4 py-1.5 text-[12px] font-body tracking-wider uppercase rounded-full
                      transition-all duration-300 border
                      ${activeFilter === f.value
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
                      }
                    `}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="hidden md:flex items-baseline gap-1.5">
                <span ref={countRef} className="font-display text-3xl italic text-foreground">
                  {filteredProjects.length}
                </span>
                <span className="text-xs font-body text-muted-foreground tracking-wide">projects</span>
              </div>
            </div>

            {/* Heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl italic tracking-wide leading-[0.95]">
                  {headingText}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground font-body max-w-lg leading-relaxed">
                  {subtitleText}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Divider */}
            <div className="mt-12 h-px bg-border" />
          </div>
        </section>

        {/* Projects */}
        <section className="py-12 md:py-16 px-4 md:px-6 max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDesignView ? (
                  <DesignShowcase projects={filteredProjects} />
                ) : (
                  <PortfolioGrid projects={filteredProjects} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </section>

        <div className="h-16" />
      </div>
    </>
  );
}
