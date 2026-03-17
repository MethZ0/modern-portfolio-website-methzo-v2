import React from 'react';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  showCategory?: boolean;
  index?: number;
  onClick?: () => void;
}

export function ProjectCard({ 
  project, 
  aspectRatio, 
  showCategory = true,
  index = 0,
  onClick
}: ProjectCardProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const categoryLabels: Record<string, string> = {
    'web-app': 'Web App',
    'mobile-app': 'Mobile App',
    'fullstack': 'Full Stack',
    'api': 'API',
    'open-source': 'Open Source',
    'ui-ux': 'UI-UX',
    'design': 'Design',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <button onClick={onClick} className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
        <div className="relative overflow-hidden rounded-xl">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[4/3] bg-muted">
            {!isLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
            <img
              src={project.coverImage}
              alt={project.title}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-all duration-500',
                isLoaded ? 'opacity-100' : 'opacity-0',
                'group-hover:scale-110'
              )}
              loading={index < 6 ? 'eager' : 'lazy'}
              onLoad={() => setIsLoaded(true)}
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/0 group-hover:from-black/80 group-hover:via-black/40 transition-all duration-500" />
            
            {/* Category badge */}
            {showCategory && (
              <div className="absolute top-2.5 left-2.5 z-10">
                <Badge variant="secondary" className="font-body font-normal text-[10px] tracking-wider uppercase bg-background/70 backdrop-blur-md border-0 px-2 py-0.5">
                  {categoryLabels[project.category] || project.category}
                </Badge>
              </div>
            )}

            {/* Arrow icon on hover */}
            <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <div className="p-1.5 bg-primary-foreground rounded-full">
                <ArrowUpRight className="size-3 text-foreground" />
              </div>
            </div>

            {/* Bottom info overlay on hover */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
              <p className="text-[11px] text-white/80 font-body leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Title below image */}
        <div className="mt-2.5 space-y-0.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-body font-medium tracking-wide group-hover:text-muted-foreground transition-colors truncate">
              {project.title}
            </h3>
            <span className="text-[10px] text-muted-foreground font-body ml-2 shrink-0">{project.year}</span>
          </div>
          {project.techStack && (
            <p className="text-[10px] text-muted-foreground/60 font-body tracking-wide truncate">
              {project.techStack}
            </p>
          )}
        </div>
      </button>
    </motion.div>
  );
}
