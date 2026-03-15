import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, MapPin, GraduationCap, Briefcase, Award, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { photographerInfo } from '@/data/photographer';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo/SEOHead';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const bioRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bioRef.current) {
        const paragraphs = bioRef.current.querySelectorAll('p');
        gsap.fromTo(paragraphs,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: bioRef.current, start: 'top 80%' },
          }
        );
      }

      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll('.stat-item');
        gsap.fromTo(items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEOHead
        title="About"
        description={`Learn about ${photographerInfo.name}, ${photographerInfo.tagline}.`}
      />

      <div className="min-h-screen">
        {/* Hero — editorial split */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.1fr] min-h-[85vh]">
            {/* Left — image */}
            <motion.div
              className="relative bg-muted overflow-hidden min-h-[45vh] sm:min-h-[56vh] lg:min-h-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={photographerInfo.portraitImage}
                alt={photographerInfo.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background/20" />
            </motion.div>

            {/* Right — intro text */}
            <div className="flex flex-col justify-center px-6 py-14 sm:px-8 sm:py-16 lg:px-16 lg:py-28">
              <motion.div
                className="space-y-6 max-w-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-xs font-body tracking-[0.25em] uppercase text-muted-foreground">About me</p>
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl italic tracking-wide leading-[1.05]">
                  {photographerInfo.name}
                </h1>
                <p className="text-lg font-body text-muted-foreground leading-relaxed">
                  {photographerInfo.heroIntroduction}
                </p>

                {/* Quick info pills */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {photographerInfo.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground">
                    <GraduationCap className="size-3.5" />
                    SLIIT
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground">
                    <Briefcase className="size-3.5" />
                    {photographerInfo.availability}
                  </span>
                </div>

                {/* Social */}
                <div className="flex items-center gap-3 pt-4">
                  {photographerInfo.socialLinks.github && (
                    <Button variant="outline" size="sm" asChild className="gap-2 rounded-full">
                      <a href={photographerInfo.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="size-4" /> GitHub
                      </a>
                    </Button>
                  )}
                  {photographerInfo.socialLinks.linkedin && (
                    <Button variant="outline" size="sm" asChild className="gap-2 rounded-full">
                      <a href={photographerInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="size-4" /> LinkedIn
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild className="gap-2 rounded-full">
                    <a href={`mailto:${photographerInfo.email}`}>
                      <Mail className="size-4" /> Email
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Biography */}
        <section className="py-24 md:py-32 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <h2 className="font-display text-3xl md:text-4xl italic tracking-wide sticky top-28">
                My Story
              </h2>
            </div>
            <div ref={bioRef} className="space-y-6">
              {photographerInfo.biography.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-base font-body leading-[1.9] text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <Separator className="max-w-5xl mx-auto" />

        {/* Approach */}
        <section className="py-24 md:py-32 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <h2 className="font-display text-3xl md:text-4xl italic tracking-wide sticky top-28">
                Approach
              </h2>
            </div>
            <div className="space-y-6">
              {photographerInfo.approach.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="text-base font-body leading-[1.9] text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>
        </section>

        <Separator className="max-w-5xl mx-auto" />

        {/* Tech Stack + Awards */}
        <section className="py-24 md:py-32 px-6 lg:px-8" ref={statsRef}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24">
            {/* Tech Stack */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl md:text-3xl italic tracking-wide">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {photographerInfo.clients.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="stat-item font-body text-sm px-4 py-2 rounded-full"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl md:text-3xl italic tracking-wide">Recognition</h3>
              <ul className="space-y-4">
                {photographerInfo.awards.map((award, i) => (
                  <li key={i} className="stat-item flex items-start gap-3 group">
                    <Award className="size-4 mt-1 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                    <span className="text-base font-body text-muted-foreground group-hover:text-foreground transition-colors">
                      {award}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 px-6 lg:px-8 border-t border-border bg-muted/30">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.h2
              className="font-display text-4xl md:text-5xl italic tracking-wide"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Let's build something together
            </motion.h2>
            <p className="text-muted-foreground font-body text-lg max-w-md mx-auto">
              I'm open to internships, collaborations, and exciting opportunities.
            </p>
            <Button asChild size="lg" className="rounded-full gap-2 mt-2">
              <a href={`mailto:${photographerInfo.email}`}>
                Get in Touch <ChevronRight className="size-4" />
              </a>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
