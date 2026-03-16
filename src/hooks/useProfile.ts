import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { photographerInfo } from '@/data/photographer';

export type SiteProfile = {
  id: string;
  name: string;
  tagline: string;
  hero_subtitle: string;
  hero_cta_left: string;
  hero_cta_right: string;
  about_headline: string;
  hero_intro: string;
  biography: string;
  approach: string;
  education: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  portrait_image: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  cv_url: string;
  tech_stack: string[];
  awards: string[];
};

/** Static fallback so pages never render empty while Supabase loads */
export const profileFallback: SiteProfile = {
  id: '',
  name: photographerInfo.name,
  tagline: photographerInfo.tagline,
  hero_subtitle: 'Designer & Developer',
  hero_cta_left: 'Creative Works',
  hero_cta_right: 'Development',
  about_headline: 'Crafting digital\nexperiences',
  hero_intro: photographerInfo.heroIntroduction,
  biography: photographerInfo.biography,
  approach: photographerInfo.approach,
  education: photographerInfo.education,
  location: photographerInfo.location,
  email: photographerInfo.email,
  phone: photographerInfo.phone || '',
  availability: photographerInfo.availability,
  portrait_image: photographerInfo.portraitImage,
  github_url: photographerInfo.socialLinks.github || '',
  linkedin_url: photographerInfo.socialLinks.linkedin || '',
  twitter_url: '',
  cv_url: '',
  tech_stack: photographerInfo.clients,
  awards: photographerInfo.awards,
};

export function useProfile() {
  return useQuery<SiteProfile>({
    queryKey: ['site_profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_profile')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return (data as SiteProfile) ?? profileFallback;
    },
    placeholderData: profileFallback,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Omit<SiteProfile, 'id'>> & { id: string }) => {
      const { id, ...rest } = payload;
      const { error } = await supabase
        .from('site_profile')
        .update(rest as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_profile'] });
    },
  });
}
