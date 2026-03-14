import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Skill {
  id: string;
  name: string;
  category: string;
  percentage: number;
  sort_order: number;
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category')
        .order('sort_order');
      if (error) throw error;
      return data as Skill[];
    },
  });
}

export function useSkillsMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['skills'] });

  const addSkill = useMutation({
    mutationFn: async (skill: Omit<Skill, 'id'>) => {
      const { error } = await supabase.from('skills').insert(skill);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateSkill = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Skill> & { id: string }) => {
      const { error } = await supabase.from('skills').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteSkill = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { addSkill, updateSkill, deleteSkill };
}
