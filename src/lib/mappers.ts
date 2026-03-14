import type { Tables } from '@/integrations/supabase/types';
import type { Project, ProjectImage } from '@/types';

type DbProject = Tables<'projects'>;

export function mapDbProject(p: DbProject): Project {
  const images: ProjectImage[] = Array.isArray(p.images)
    ? (p.images as any[]).map((img, i) => ({
        id: img.id || `${p.id}-${i}`,
        src: img.src || '',
        alt: img.alt || p.title,
        aspectRatio: img.aspectRatio || 'landscape',
        caption: img.caption,
      }))
    : [];

  return {
    id: p.id,
    title: p.title,
    category: p.category as Project['category'],
    year: p.year,
    coverImage: p.cover_image,
    images,
    description: p.description,
    client: p.client ?? undefined,
    techStack: p.tech_stack ?? undefined,
    location: p.location ?? undefined,
    slug: p.slug,
    githubUrl: p.github_url ?? undefined,
    liveUrl: p.live_url ?? undefined,
  };
}
