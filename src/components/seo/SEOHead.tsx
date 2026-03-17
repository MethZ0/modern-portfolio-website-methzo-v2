import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProfile, profileFallback } from '@/hooks/useProfile';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

export function SEOHead({ 
  title, 
  description, 
  image = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  type = 'website'
}: SEOHeadProps) {
  const location = useLocation();
  
  const { data: dbProfile } = useProfile();
  const profile = dbProfile || profileFallback;

  const fullTitle = title 
    ? `${title} | ${profile.name}` 
    : `${profile.name} - ${profile.tagline}`;
  
  const fullDescription = description || profile.about_headline;
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}${location.pathname}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="author" content={profile.name} />
      <meta name="keywords" content={`software engineer, ${profile.name}, full-stack developer, UI/UX, SLIIT`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={profile.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
