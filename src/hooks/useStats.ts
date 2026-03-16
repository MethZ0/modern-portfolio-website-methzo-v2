import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type DashboardStats = {
  totalProjects: number;
  totalSkills: number;
  unreadMessages: number;
  lastUpdated: string | null;
};

export function useStats() {
  return useQuery<DashboardStats>({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      // 1. Total projects
      const { count: projectsCount, error: pErr } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      if (pErr) throw pErr;

      // 2. Total skills
      const { count: skillsCount, error: sErr } = await supabase
        .from('skills')
        .select('*', { count: 'exact', head: true });
      if (sErr) throw sErr;

      // 3. Unread messages
      const { count: unreadCount, error: uErr } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      if (uErr) throw uErr;

      // 4. Last updated date (from projects)
      const { data: latestProject, error: lErr } = await supabase
        .from('projects')
        .select('updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (lErr) throw lErr;

      return {
        totalProjects: projectsCount || 0,
        totalSkills: skillsCount || 0,
        unreadMessages: unreadCount || 0,
        lastUpdated: latestProject?.updated_at || null,
      };
    },
    staleTime: 1000 * 60, // Cache for 1 minute
  });
}
