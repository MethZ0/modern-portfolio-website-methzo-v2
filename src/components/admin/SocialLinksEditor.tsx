import { useState, useEffect } from 'react';
import { useProfile, useProfileMutation } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Github, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'sonner';

export function SocialLinksEditor() {
  const { data: profile, isLoading } = useProfile();
  const mutation = useProfileMutation();

  const [form, setForm] = useState({
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        github_url: profile.github_url,
        linkedin_url: profile.linkedin_url,
        twitter_url: profile.twitter_url,
      });
    }
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile?.id) { toast.error('Profile not loaded yet'); return; }
    try {
      await mutation.mutateAsync({ id: profile.id, ...form });
      toast.success('Social links saved');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
          <Github className="size-3.5" /> GitHub URL
        </Label>
        <Input
          value={form.github_url}
          onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))}
          placeholder="https://github.com/username"
          className="font-body"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
          <Linkedin className="size-3.5" /> LinkedIn URL
        </Label>
        <Input
          value={form.linkedin_url}
          onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))}
          placeholder="https://linkedin.com/in/username"
          className="font-body"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
          <Twitter className="size-3.5" /> Twitter / X URL
        </Label>
        <Input
          value={form.twitter_url}
          onChange={e => setForm(f => ({ ...f, twitter_url: e.target.value }))}
          placeholder="https://twitter.com/username"
          className="font-body"
        />
      </div>

      <Button type="submit" className="font-body" disabled={mutation.isPending}>
        {mutation.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
        <Save className="size-4 mr-1" /> Save Social Links
      </Button>
    </form>
  );
}
