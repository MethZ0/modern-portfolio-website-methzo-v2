import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  medium_url: string;
  tags: string[];
  published_at: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export function usePosts(onlyPublished = true) {
  return useQuery<Post[]>({
    queryKey: ['posts', onlyPublished],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });
      if (onlyPublished) query = query.eq('is_published', true);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Post[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function usePostMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const addPost = useMutation({
    mutationFn: async (payload: Omit<Post, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('posts').insert(payload as any);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, ...rest }: Partial<Post> & { id: string }) => {
      const { error } = await supabase.from('posts').update(rest as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { addPost, updatePost, deletePost };
}
