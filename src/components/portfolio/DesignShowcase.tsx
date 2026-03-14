import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';
import { Badge } from '@/components/ui/badge';

interface DesignShowcaseProps {
  projects: Project[];
}

/**
 * Artistic masonry-style showcase for design/UI-UX projects
 * Features large hero images, accent colors, staggered layout, and editorial typography
 */
export function DesignShowcase({ projects }: DesignShowcaseProps) {
  return (
    <div className="space-y-24 md:space-y-32">
      {projects.map((project, index) => (
        <DesignShowcaseItem key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}

function DesignShowcaseItem({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/project/${project.slug}`} className="group block">
        {/* Full-width hero image with accent color wash */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Accent color gradient overlay */}
          <div
            className="absolute inset-0 z-10 opacity-20 mix-blend-multiply dark:mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-30"
            style={{
              background: project.accentColor
                ? `linear-gradient(135deg, ${project.accentColor}, transparent 70%)`
                : undefined,
            }}
          />

          {/* Main image */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-muted">
            <motion.img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          </div>

          {/* Floating project number */}
          <div className="absolute top-6 left-6 z-20">
            <span
              className="font-display text-7xl md:text-9xl italic leading-none opacity-30 text-primary-foreground select-none"
              style={{ color: project.accentColor || undefined }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Hover arrow */}
          <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <div className="p-3 rounded-full bg-background/80 backdrop-blur-md">
              <ArrowUpRight className="size-5" />
            </div>
          </div>
        </div>

        {/* Project info - offset layout */}
        <div
          className={`mt-8 md:mt-10 grid md:grid-cols-12 gap-4 md:gap-8 ${
            isEven ? 'md:text-left' : 'md:text-right'
          }`}
        >
          <div className={`md:col-span-7 ${isEven ? 'md:col-start-1' : 'md:col-start-6'}`}>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge variant="outline" className="font-body font-normal text-xs">
                {project.year}
              </Badge>
              {project.techStack && (
                <Badge variant="secondary" className="font-body font-normal text-xs">
                  {project.techStack}
                </Badge>
              )}
            </div>

            <h3 className="font-display text-3xl md:text-5xl italic tracking-wide mb-3 group-hover:text-muted-foreground transition-colors duration-500">
              {project.title}
            </h3>

            <p className="text-sm md:text-base font-body text-muted-foreground leading-[1.8] max-w-xl">
              {project.description}
            </p>
          </div>
        </div>

        {/* Preview images strip */}
        {project.images.length > 1 && (
          <div className="mt-6 flex gap-3 overflow-hidden">
            {project.images.slice(1, 4).map((img, i) => (
              <motion.div
                key={img.id}
                className="relative flex-1 aspect-[4/3] rounded-lg overflow-hidden bg-muted"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * (i + 1), duration: 0.6 }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
