import { motion } from 'framer-motion';
import { Mail, MapPin, Github, Linkedin, ArrowUpRight, Clock } from 'lucide-react';
import { photographerInfo } from '@/data/photographer';
import { ContactForm } from '@/components/forms/ContactForm';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo/SEOHead';

export default function Contact() {
  return (
    <>
      <SEOHead
        title="Contact"
        description={`Get in touch with ${photographerInfo.name} for collaborations, freelance projects, and internship opportunities.`}
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative py-28 md:py-40 px-6 lg:px-8 pb-32 md:pb-44">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-body tracking-[0.25em] uppercase text-muted-foreground">Contact</p>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl italic tracking-wide leading-[1.05] max-w-3xl">
                Let's work together
              </h1>
              <p className="text-lg font-body text-muted-foreground max-w-lg leading-relaxed">
                Have a project in mind or want to collaborate? I'd love to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-20 md:py-28 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_340px] gap-16 lg:gap-20">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="font-display text-2xl md:text-3xl italic tracking-wide mb-2">Send a message</h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                Fill out the form and I'll get back to you within 24–48 hours.
              </p>
              <ContactForm />
            </motion.div>

            {/* Sidebar info */}
            <motion.aside
              className="space-y-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              {/* Contact details */}
              <div className="space-y-5">
                <h3 className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground">Direct</h3>

                <a
                  href={`mailto:${photographerInfo.email}`}
                  className="flex items-center gap-3 group py-3 border-b border-border"
                >
                  <Mail className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-sm font-body group-hover:text-foreground transition-colors text-muted-foreground">
                    {photographerInfo.email}
                  </span>
                  <ArrowUpRight className="size-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                </a>

                <div className="flex items-center gap-3 py-3 border-b border-border">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="text-sm font-body text-muted-foreground">{photographerInfo.location}</span>
                </div>

                <div className="flex items-center gap-3 py-3 border-b border-border">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-sm font-body text-muted-foreground">{photographerInfo.availability}</span>
                </div>
              </div>

              <Separator />

              {/* Social */}
              <div className="space-y-4">
                <h3 className="text-xs font-body tracking-[0.2em] uppercase text-muted-foreground">Socials</h3>
                <div className="flex flex-col gap-1">
                  {photographerInfo.socialLinks.github && (
                    <Button variant="ghost" size="sm" asChild className="justify-start gap-3 px-0 h-10 font-body text-muted-foreground hover:text-foreground">
                      <a href={photographerInfo.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="size-4" /> GitHub
                        <ArrowUpRight className="size-3.5 ml-auto" />
                      </a>
                    </Button>
                  )}
                  {photographerInfo.socialLinks.linkedin && (
                    <Button variant="ghost" size="sm" asChild className="justify-start gap-3 px-0 h-10 font-body text-muted-foreground hover:text-foreground">
                      <a href={photographerInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="size-4" /> LinkedIn
                        <ArrowUpRight className="size-3.5 ml-auto" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        </section>
      </div>
    </>
  );
}
