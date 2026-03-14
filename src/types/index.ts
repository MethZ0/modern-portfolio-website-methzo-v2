/**
 * Core TypeScript interfaces for Methush Anjula's Portfolio
 */

export type ProjectCategory = 'web-app' | 'mobile-app' | 'fullstack' | 'api' | 'open-source' | 'ui-ux' | 'design';

export type AspectRatio = 'portrait' | 'landscape' | 'square';

export interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  aspectRatio: AspectRatio;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  coverImage: string;
  images: ProjectImage[];
  description: string;
  client?: string;
  techStack?: string;
  location?: string;
  slug: string;
  githubUrl?: string;
  liveUrl?: string;
  /** Optional accent color for design projects (HSL string) */
  accentColor?: string;
}

export interface PhotographerInfo {
  name: string;
  tagline: string;
  heroIntroduction: string;
  biography: string;
  approach: string;
  awards: string[];
  clients: string[];
  education: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  portraitImage: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  projectType: 'collaboration' | 'freelance' | 'internship';
  message: string;
  timestamp: Date;
}
