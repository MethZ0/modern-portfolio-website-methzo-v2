import { useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { photographerInfo } from '@/data/photographer';
import { useFeaturedProjects } from '@/hooks/useProjects';
import { useSkills } from '@/hooks/useSkills';
import { mapDbProject } from '@/lib/mappers';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Monitor, Server, Database, GitBranch, Palette, Smartphone, Code as CodeIcon } from 'lucide-react';
import { HeroBackground } from '@/components/three/HeroBackground';
import {
  FloatingCircle,
  AbstractBlob,
  GridDots,
  WavyLine,
  CrosshairMark,
  DiagonalLines,
  ArrowVector,
  AbstractShape,
} from '@/components/vectors/Vectors';

const profileReal = '/profile.jpg';
const profileCartoon = '/profile-cartoon.jpg';

gsap.registerPlugin(ScrollTrigger);

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Frontend: Monitor,
  Backend: Server,
  Database: Database,
  DevOps: GitBranch,
  'UI/UX': Palette,
  Mobile: Smartphone,
};

export default function Home() {
  const { data: dbFeatured } = useFeaturedProjects();
  const { data: dbSkills = [] } = useSkills();
  const featuredProjects = useMemo(() => (dbFeatured || []).map(mapDbProject), [dbFeatured]);
  const skillCategories = useMemo(() => {
    const grouped = dbSkills.reduce<Record<string, { name: string; percentage: number }[]>>((acc, s) => {
      (acc[s.category] = acc[s.category] || []).push({ name: s.name, percentage: s.percentage });
      return acc;
    }, {});
    return Object.entries(grouped).map(([title, skills]) => ({
      icon: categoryIcons[title] || CodeIcon,
      title,
      skills,
    }));
  }, [dbSkills]);
  const navigate = useNavigate();
  const mainRef = useRef<HTMLDivElement>(null);

  // Refs for GSAP
  const heroRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroLeftRef = useRef<HTMLDivElement>(null);
  const heroRightRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLDivElement>(null);
  const aboutImageRef = useRef<HTMLDivElement>(null);
  const aboutVectorRef = useRef<HTMLDivElement>(null);

  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const skillsHeadingRef = useRef<HTMLDivElement>(null);
  const skillsCardsRef = useRef<HTMLDivElement>(null);
  const skillsVectorRef = useRef<HTMLDivElement>(null);

  const splitSectionRef = useRef<HTMLDivElement>(null);
  const splitLeftRef = useRef<HTMLDivElement>(null);
  const splitRightRef = useRef<HTMLDivElement>(null);
  const splitDividerRef = useRef<HTMLDivElement>(null);

  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const projectsHeadingRef = useRef<HTMLDivElement>(null);
  const projectsHorizontalRef = useRef<HTMLDivElement>(null);

  const ctaSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── HERO entrance ──
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      heroTl
        .from(heroNameRef.current, { y: 120, opacity: 0, duration: 1.4 })
        .from(heroSubRef.current, { y: 40, opacity: 0, duration: 1 }, '-=0.8')
        .from(heroLeftRef.current, { x: -80, opacity: 0, duration: 1 }, '-=0.6')
        .from(heroRightRef.current, { x: 80, opacity: 0, duration: 1 }, '-=0.9')
        .from(scrollCueRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');

      // Parallax on hero vectors
      gsap.to('.hero-vector-1', {
        y: -100, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-vector-2', {
        y: -60, rotation: 15, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });

      // ── ABOUT section ──
      gsap.from(aboutTextRef.current?.children || [], {
        y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: aboutSectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
      });
      gsap.from(aboutImageRef.current, {
        x: 100, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: aboutSectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
      gsap.from(aboutVectorRef.current, {
        scale: 0.5, opacity: 0, rotation: -30, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: aboutSectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });

      // ── SKILLS section ──
      gsap.from(skillsHeadingRef.current?.children || [], {
        x: -80, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: skillsSectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
      });
      const skillCards = skillsCardsRef.current?.children;
      if (skillCards) {
        gsap.from(skillCards, {
          y: 80, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.08, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: skillsCardsRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      }
      gsap.to(skillsVectorRef.current, {
        rotation: 360, ease: 'none',
        scrollTrigger: { trigger: skillsSectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      // ── SPLIT EXPLORE section ──
      gsap.from(splitLeftRef.current, {
        x: '-100%', opacity: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: splitSectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
      gsap.from(splitRightRef.current, {
        x: '100%', opacity: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: splitSectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
      gsap.from(splitDividerRef.current, {
        scaleY: 0, duration: 0.8, delay: 0.3, ease: 'power3.out',
        scrollTrigger: { trigger: splitSectionRef.current, start: 'top 65%', toggleActions: 'play none none reverse' },
      });

      // ── PROJECTS horizontal scroll ──
      gsap.from(projectsHeadingRef.current?.children || [], {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: projectsSectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
      });

      const horizontalEl = projectsHorizontalRef.current;
      if (horizontalEl && horizontalEl.children.length > 0) {
        const totalScroll = horizontalEl.scrollWidth - window.innerWidth;
        if (totalScroll > 0) {
          gsap.to(horizontalEl, {
            x: -totalScroll,
            ease: 'none',
            scrollTrigger: {
              trigger: projectsSectionRef.current,
              start: 'top top',
              end: () => `+=${totalScroll}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      // ── CTA section ──
      gsap.from(ctaSectionRef.current?.children || [], {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: ctaSectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });

    }, mainRef);

    return () => ctx.revert();
  }, [featuredProjects]);

  return (
    <>
      <SEOHead />
      <div ref={mainRef} className="min-h-screen overflow-x-hidden">

        {/* ═══════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════ */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* 3D Particle Background */}
          <HeroBackground />

          {/* Vector decorations */}
          <div className="hero-vector-1 absolute top-10 left-10 md:left-20 text-foreground z-[1]">
            <FloatingCircle className="w-40 md:w-64" />
          </div>
          <div className="hero-vector-2 absolute bottom-20 right-10 md:right-20 text-foreground z-[1]">
            <AbstractShape className="w-48 md:w-72" />
          </div>
          <div className="absolute top-1/4 right-1/4 text-foreground z-[1]">
            <GridDots className="w-32 md:w-48 opacity-40" />
          </div>
          <div className="absolute bottom-1/3 left-1/4 text-foreground z-[1]">
            <CrosshairMark className="w-10 md:w-14" />
          </div>

          {/* Main hero content */}
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <h1 ref={heroNameRef} className="font-display text-6xl md:text-8xl lg:text-[10rem] italic tracking-wide leading-[0.9]">
              Methush
              <br />
              <span className="not-italic text-muted-foreground">Anjula</span>
            </h1>
            <p ref={heroSubRef} className="mt-6 md:mt-8 text-sm md:text-lg font-body tracking-[0.3em] uppercase text-muted-foreground">
              Designer & Developer
            </p>

            {/* Quick navigation pills */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <div ref={heroLeftRef}>
                <Button variant="outline" size="lg" className="font-body rounded-full gap-2" onClick={() => navigate('/portfolio?filter=design')}>
                  <Palette className="size-4" />
                  Creative Works
                </Button>
              </div>
              <div ref={heroRightRef}>
                <Button variant="outline" size="lg" className="font-body rounded-full gap-2" onClick={() => navigate('/portfolio?filter=development')}>
                  <CodeIcon className="size-4" />
                  Development
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div ref={scrollCueRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs font-body tracking-[0.2em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-border animate-pulse" />
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0 text-border">
            <WavyLine className="w-full h-8" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            ABOUT SECTION - text slides from left, image from right
        ═══════════════════════════════════════════ */}
        <section ref={aboutSectionRef} className="relative py-32 md:py-44 px-6 lg:px-8">
          {/* Background vector */}
          <div ref={aboutVectorRef} className="absolute -top-20 -right-20 text-foreground pointer-events-none">
            <AbstractBlob className="w-[500px] md:w-[700px]" />
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div ref={aboutTextRef} className="space-y-6">
              <span className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground">About Me</span>
              <h2 className="font-display text-4xl md:text-6xl italic tracking-wide leading-[1.1]">
                Crafting digital
                <br />
                experiences
              </h2>
              <Separator className="w-16" />
              <p className="text-base font-body leading-[1.9] text-muted-foreground max-w-lg">
                {photographerInfo.biography.split('\n\n')[0]}
              </p>
              <Button variant="ghost" asChild className="group font-body">
                <Link to="/about">
                  Learn More About Me
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div ref={aboutImageRef} className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
                <img
                  src={profileReal}
                  alt={photographerInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating vector accent */}
              <div className="absolute -bottom-8 -left-8 text-foreground">
                <DiagonalLines className="w-32" />
              </div>
              <div className="absolute -top-6 -right-6 text-foreground">
                <CrosshairMark className="w-12" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SKILLS - heading slides from left, cards stagger up
        ═══════════════════════════════════════════ */}
        <section ref={skillsSectionRef} className="relative py-32 md:py-44 border-t border-border overflow-hidden">
          {/* Rotating vector */}
          <div ref={skillsVectorRef} className="absolute top-1/2 -translate-y-1/2 -left-32 text-foreground pointer-events-none">
            <FloatingCircle className="w-64 md:w-96" />
          </div>

          <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
            <div ref={skillsHeadingRef} className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-3">
                <span className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground block">What I Do</span>
                <h2 className="font-display text-4xl md:text-6xl italic tracking-wide">
                  Skills & Expertise
                </h2>
              </div>
              <p className="text-sm font-body text-muted-foreground max-w-xs leading-relaxed">
                Technologies and tools I use to bring ideas to life.
              </p>
            </div>

            <div ref={skillsCardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {skillCategories.map((category) => (
                <div
                  key={category.title}
                  className="group relative rounded-xl border border-border bg-card p-6 hover:border-foreground/15 transition-all duration-500 hover:shadow-lg hover:shadow-foreground/[0.03]"
                >
                  {/* Gradient accent on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* Icon + title */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex items-center justify-center size-10 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors duration-400">
                        <category.icon className="size-5 text-muted-foreground group-hover:text-foreground transition-colors duration-400" />
                      </div>
                      <h3 className="text-base font-body font-medium tracking-wide">{category.title}</h3>
                    </div>

                    {/* Skills with progress */}
                    <div className="space-y-2.5">
                      {category.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-body tracking-wide text-muted-foreground group-hover:text-foreground transition-colors duration-400">
                              {skill.name}
                            </span>
                            <span className="text-[10px] font-body text-muted-foreground/60">{skill.percentage}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary/60 group-hover:bg-primary transition-all duration-500"
                              style={{ width: `${skill.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute -bottom-4 -right-4 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowVector className="w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SPLIT EXPLORE - creative vs development
        ═══════════════════════════════════════════ */}
        <section ref={splitSectionRef} className="relative h-[70vh] md:h-[80vh] overflow-hidden">
          {/* Left - Creative with cartoon (show right half of cartoon) */}
          <div
            ref={splitLeftRef}
            className="absolute top-0 left-0 w-1/2 h-full cursor-pointer overflow-hidden group z-10"
            onClick={() => navigate('/portfolio?filter=design')}
          >
            {/* Image is 200% width, positioned so the right half of the face is visible */}
            <img
              src={profileCartoon}
              alt="Creative Side"
              className="absolute top-0 left-0 w-[200%] h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent transition-opacity duration-500 group-hover:from-foreground/80" />
            <div className="absolute inset-0 flex flex-col justify-end items-start p-8 md:p-14 z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                  <Palette className="size-4 text-primary-foreground" />
                </div>
                <span className="text-primary-foreground/60 text-xs font-body tracking-[0.2em] uppercase">Creative</span>
              </div>
              <h3 className="font-display text-3xl md:text-5xl text-primary-foreground italic">UI/UX Design</h3>
              <p className="text-primary-foreground/40 text-sm font-body mt-2">Figma · Adobe XD · Responsive</p>
            </div>
          </div>

          {/* Right - Development with real photo (show left half of real photo) */}
          <div
            ref={splitRightRef}
            className="absolute top-0 right-0 w-1/2 h-full cursor-pointer overflow-hidden group z-10"
            onClick={() => navigate('/portfolio?filter=development')}
          >
            {/* Image is 200% width, shifted left so the left half of the face is visible */}
            <img
              src={profileReal}
              alt="Developer Side"
              className="absolute top-0 right-0 w-[200%] h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent transition-opacity duration-500 group-hover:from-foreground/80" />
            <div className="absolute inset-0 flex flex-col justify-end items-end p-8 md:p-14 text-right z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary-foreground/60 text-xs font-body tracking-[0.2em] uppercase">Technical</span>
                <div className="p-1.5 rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                  <CodeIcon className="size-4 text-primary-foreground" />
                </div>
              </div>
              <h3 className="font-display text-3xl md:text-5xl text-primary-foreground italic">Development</h3>
              <p className="text-primary-foreground/40 text-sm font-body mt-2">React · Node.js · TypeScript</p>
            </div>
          </div>

          {/* Center divider */}
          <div ref={splitDividerRef} className="absolute top-0 left-1/2 -translate-x-1/2 z-20 h-full w-px bg-primary-foreground/30 origin-top" />

          {/* Center label */}
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <span className="font-display text-lg md:text-xl italic text-primary-foreground/60 bg-foreground/30 backdrop-blur-md px-6 py-2 rounded-full">
              Explore
            </span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FEATURED PROJECTS - horizontal scroll on desktop
        ═══════════════════════════════════════════ */}
        <section ref={projectsSectionRef} className="relative pt-24 pb-12 border-t border-border overflow-hidden">
          {/* Vector accent */}
          <div className="absolute top-20 right-10 text-foreground pointer-events-none">
            <GridDots className="w-40 opacity-30" />
          </div>

          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div ref={projectsHeadingRef} className="mb-12 space-y-3">
              <span className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground block">Portfolio</span>
              <h2 className="font-display text-4xl md:text-6xl italic tracking-wide">
                Featured Projects
              </h2>
              <p className="text-base text-muted-foreground font-body">Scroll to explore →</p>
            </div>
          </div>

          {/* Horizontal scrolling cards */}
          <div
            ref={projectsHorizontalRef}
            className="flex gap-6 px-6 lg:px-8 pb-8 pt-4 will-change-transform"
          >
            {featuredProjects.map((project, index) => (
              <div key={project.id} className="min-w-[240px] md:min-w-[260px] flex-shrink-0">
                <ProjectCard project={project} aspectRatio="landscape" showCategory index={index} />
              </div>
            ))}
            {/* "View all" card */}
            <div className="min-w-[280px] flex-shrink-0 flex items-center justify-center">
              <Link
                to="/portfolio"
                className="group flex flex-col items-center gap-4 text-center p-8"
              >
                <div className="p-4 rounded-full border border-border group-hover:border-foreground/20 transition-colors">
                  <ArrowRight className="size-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <span className="font-display text-xl italic text-muted-foreground group-hover:text-foreground transition-colors">
                  View All
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CTA SECTION
        ═══════════════════════════════════════════ */}
        <section className="relative py-32 md:py-44 border-t border-border overflow-hidden">
          <div className="absolute inset-0 text-foreground pointer-events-none">
            <AbstractBlob className="absolute -bottom-40 -left-40 w-[600px]" />
          </div>
          <div className="absolute top-20 right-20 text-foreground pointer-events-none">
            <FloatingCircle className="w-48" />
          </div>

          <div ref={ctaSectionRef} className="max-w-3xl mx-auto px-6 text-center relative z-10 space-y-6">
            <span className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground">Get in Touch</span>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl italic tracking-wide leading-[1.1]">
              Let's create
              <br />
              something together
            </h2>
            <p className="text-base font-body text-muted-foreground max-w-md mx-auto leading-[1.8]">
              {photographerInfo.availability}. Whether it's a design project or a full-stack application, I'm ready to bring ideas to life.
            </p>
            <div className="pt-4">
              <Button size="lg" asChild className="font-body rounded-full px-8 gap-2">
                <Link to="/contact">
                  Start a Conversation
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
