import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, MapPin, Code, User, ArrowUpRight, Github, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageWithLightbox } from '@/components/portfolio/ImageWithLightbox';
import { Lightbox } from '@/components/portfolio/Lightbox';
import type { Project } from '@/types';
import { Button } from '@/components/ui/button';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background h-[90vh] md:h-[85vh] flex flex-col gap-0 border-border/50 [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{project.title}</DialogTitle>
            <DialogDescription>{project.description}</DialogDescription>
          </DialogHeader>

          {/* Custom Visible Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute bottom-6 right-6 md:top-6 md:bottom-auto md:right-6 z-[100] size-12 md:size-10 rounded-full bg-background/80 shadow-2xl backdrop-blur-md hover:bg-background/100 text-foreground border border-border/50"
          >
            <X className="size-5 md:size-5" />
            <span className="sr-only">Close</span>
          </Button>

          <ScrollArea className="flex-1 overflow-y-auto">
            {/* Hero Image */}
            <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-muted flex-shrink-0">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            </div>

            <div className="px-6 md:px-10 pb-12 pt-6 shrink-0 z-10 relative">
              <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto -mt-16 md:-mt-24">
                
                {/* Title and Badges Box */}
                <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl">
                  <h1 className="font-display text-3xl md:text-5xl italic tracking-wide mb-4">
                    {project.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <Badge variant="secondary" className="font-body font-normal text-xs gap-1">
                      <Calendar className="size-3" />
                      {project.year}
                    </Badge>
                    <Badge variant="secondary" className="font-body font-normal text-xs capitalize">
                      {project.category}
                    </Badge>
                    {project.location && (
                      <Badge variant="secondary" className="font-body font-normal text-xs gap-1">
                        <MapPin className="size-3" />
                        {project.location}
                      </Badge>
                    )}
                  </div>

                  {/* Action Links */}
                  {(project.liveUrl || project.githubUrl) && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {project.liveUrl && (
                        <Button asChild size="sm" className="font-body rounded-full h-9">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            Visit Live <ArrowUpRight className="size-3.5 ml-1.5" />
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button asChild variant="outline" size="sm" className="font-body rounded-full h-9">
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="size-3.5 mr-1.5" /> Source Code
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  <p className="text-base md:text-lg font-body leading-[1.8] text-foreground/90 whitespace-pre-line">
                    {project.description}
                  </p>

                  {/* Technical Details */}
                  {(project.techStack || project.client) && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {project.techStack && (
                        <Card className="bg-transparent border-border/50">
                          <CardContent className="p-5 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-body tracking-wider uppercase text-muted-foreground">
                              <Code className="size-4 text-primary" />
                              <span>Tech Stack</span>
                            </div>
                            <p className="text-sm font-body text-foreground leading-relaxed">
                              {project.techStack}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      {project.client && (
                        <Card className="bg-transparent border-border/50">
                          <CardContent className="p-5 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-body tracking-wider uppercase text-muted-foreground">
                              <User className="size-4 text-primary" />
                              <span>Client / Context</span>
                            </div>
                            <p className="text-sm font-body text-foreground leading-relaxed">
                              {project.client}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {/* Gallery */}
                  {project.images && project.images.length > 0 && (
                    <div className="space-y-6 pt-6">
                      <Separator className="mb-8" />
                      <h3 className="font-display text-2xl italic mb-6">Gallery</h3>
                      <div className="grid gap-6">
                        {project.images.map((image, index) => (
                          <ImageWithLightbox 
                            key={image.id} 
                            image={image} 
                            onClick={() => openLightbox(index)} 
                            priority={index === 0} 
                            index={index} 
                            className="w-full rounded-xl overflow-hidden border border-border/40 shadow-md" 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Lightbox 
        images={project.images || []} 
        currentIndex={currentImageIndex} 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
        onNavigate={setCurrentImageIndex} 
      />
    </>
  );
}
