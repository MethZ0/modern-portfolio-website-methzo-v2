import { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Code, User, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SEOHead } from '@/components/seo/SEOHead';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useProject } from '@/hooks/useProjects';
import { mapDbProject } from '@/lib/mappers';
import { ImageWithLightbox } from '@/components/portfolio/ImageWithLightbox';
import { Lightbox } from '@/components/portfolio/Lightbox';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: dbProject, isLoading } = useProject(slug || '');
  const project = useMemo(() => dbProject ? mapDbProject(dbProject) : null, [dbProject]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <SEOHead title={project.title} description={project.description} image={project.coverImage} type="article" />
      
      <div className="min-h-screen">
        {/* Hero Image */}
        <motion.div
          className="relative w-full h-[70vh] overflow-hidden bg-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        </motion.div>

        {/* Project Info */}
        <section className="max-w-3xl mx-auto px-6 lg:px-8 py-14 md:py-20">
          <motion.div
            className="space-y-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="space-y-4">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl italic tracking-wide">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-body font-normal text-xs gap-1">
                  <Calendar className="size-3" />
                  {project.year}
                </Badge>
                <Badge variant="outline" className="font-body font-normal text-xs capitalize">
                  {project.category}
                </Badge>
                {project.location && (
                  <Badge variant="outline" className="font-body font-normal text-xs gap-1">
                    <MapPin className="size-3" />
                    {project.location}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <p className="text-base md:text-lg font-body leading-[1.8] text-foreground">
              {project.description}
            </p>

            {/* Technical Details */}
            <div className="grid md:grid-cols-2 gap-4">
              {project.techStack && (
                <Card>
                  <CardContent className="p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-body tracking-wider uppercase text-muted-foreground">
                      <Code className="size-3.5" />
                      <span>Tech Stack</span>
                    </div>
                    <p className="text-sm font-body text-foreground">{project.techStack}</p>
                  </CardContent>
                </Card>
              )}
              {project.client && (
                <Card>
                  <CardContent className="p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-body tracking-wider uppercase text-muted-foreground">
                      <User className="size-3.5" />
                      <span>Client</span>
                    </div>
                    <p className="text-sm font-body text-foreground">{project.client}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </section>

        {/* Gallery */}
        <section className="py-12 md:py-16">
          <div className="space-y-8 md:space-y-12">
            {project.images.map((image, index) => (
              <ScrollReveal key={image.id} delay={index * 0.08}>
                <ImageWithLightbox image={image} onClick={() => openLightbox(index)} priority={index === 0} index={0} className="w-full" />
              </ScrollReveal>
            ))}
          </div>
        </section>

        <Lightbox images={project.images} currentIndex={currentImageIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} onNavigate={setCurrentImageIndex} />
      </div>
    </>
  );
}
