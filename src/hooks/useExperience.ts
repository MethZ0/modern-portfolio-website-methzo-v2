import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Experience = {
  id: string;
  type: 'work' | 'education';
  title: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  sort_order: number;
  created_at: string;
};

export function useExperience() {
  return useQuery<Experience[]>({
    queryKey: ['experience'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Experience[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useExperienceMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['experience'] });

  const addExperience = useMutation({
    mutationFn: async (payload: Omit<Experience, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('experience').insert(payload as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateExperience = useMutation({
    mutationFn: async ({ id, ...rest }: Partial<Experience> & { id: string }) => {
      const { error } = await supabase.from('experience').update(rest as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteExperience = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('experience').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { addExperience, updateExperience, deleteExperience };
}
