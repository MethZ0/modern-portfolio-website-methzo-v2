import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Tag, BookOpen } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/seo/SEOHead';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { BlogListSkeleton } from '@/components/ui/Skeletons';

export default function Blog() {
  const { data: posts = [], isLoading } = usePosts(true);

  return (
    <>
      <SEOHead
        title="Blog"
        description="Articles and thoughts on software engineering, design, and technology."
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="py-28 md:py-40 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-body tracking-[0.25em] uppercase text-muted-foreground">Writing</p>
              <h1 className="font-display text-5xl md:text-7xl italic tracking-wide leading-[1.05]">Blog</h1>
              <p className="text-lg font-body text-muted-foreground max-w-lg leading-relaxed">
                Thoughts on software engineering, architecture, design, and the things I'm learning.
                Published on{' '}
                <a
                  href="https://medium.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Medium
                </a>
                .
              </p>
            </motion.div>
          </div>
        </section>

        {/* Articles grid */}
        <section className="pb-28 md:pb-40 px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <BlogListSkeleton />
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                <BookOpen className="size-10 opacity-30" />
                <p className="text-sm font-body">No articles published yet.</p>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-border border-t border-border">
                {posts.map((post, i) => (
                  <motion.article
                    key={post.id}
                    className="group py-8 md:py-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <a
                      href={post.medium_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-start"
                    >
                      {/* Text content */}
                      <div className="space-y-3 min-w-0">
                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3 text-xs font-body text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {format(new Date(post.published_at), 'MMMM d, yyyy')}
                          </span>
                          {post.tags?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Tag className="size-3" />
                              {post.tags.join(' · ')}
                            </span>
                          )}
                        </div>

                        <h2 className="font-display text-2xl md:text-3xl italic tracking-wide leading-snug group-hover:text-foreground/70 transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-sm font-body text-muted-foreground leading-relaxed line-clamp-2 max-w-xl">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="font-body text-[11px] px-2.5 py-0.5 rounded-full">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 text-sm font-body font-medium pt-1 group-hover:gap-2.5 transition-all">
                          Read on Medium
                          <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                      {/* Cover image */}
                      {post.cover_image && (
                        <div className="shrink-0 w-full md:w-48 lg:w-56">
                          <div className="aspect-[16/9] md:aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                      )}
                    </a>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
