import { useState, useEffect } from 'react';
import { useProfile, useProfileMutation } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, ImagePlus, FileUp, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileEditor() {
  const { data: profile, isLoading } = useProfile();
  const mutation = useProfileMutation();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    hero_subtitle: '',
    hero_cta_left: '',
    hero_cta_right: '',
    about_headline: '',
    hero_intro: '',
    biography: '',
    approach: '',
    education: '',
    location: '',
    email: '',
    phone: '',
    availability: '',
    portrait_image: '',
    cv_url: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        tagline: profile.tagline,
        hero_subtitle: profile.hero_subtitle ?? '',
        hero_cta_left: profile.hero_cta_left ?? '',
        hero_cta_right: profile.hero_cta_right ?? '',
        about_headline: profile.about_headline ?? '',
        hero_intro: profile.hero_intro,
        biography: profile.biography,
        approach: profile.approach,
        education: profile.education,
        location: profile.location,
        email: profile.email,
        phone: profile.phone,
        availability: profile.availability,
        portrait_image: profile.portrait_image,
        cv_url: profile.cv_url ?? '',
      });
    }
  }, [profile]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'portfolio/profile');
      const { data, error } = await supabase.functions.invoke('upload-cloudinary', { body: formData });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setForm(f => ({ ...f, portrait_image: data.url }));
      toast.success('Portrait image uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile?.id) { toast.error('Profile not loaded yet'); return; }
    try {
      await mutation.mutateAsync({ id: profile.id, ...form });
      toast.success('Profile saved');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Full Name</Label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="font-body" required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Tagline</Label>
          <Input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} className="font-body" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Hero Subtitle</Label>
          <Input value={form.hero_subtitle} onChange={e => setForm(f => ({ ...f, hero_subtitle: e.target.value }))} className="font-body" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">About Headline</Label>
          <Input value={form.about_headline} onChange={e => setForm(f => ({ ...f, about_headline: e.target.value }))} className="font-body" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Hero: Left CTA</Label>
          <Input value={form.hero_cta_left} onChange={e => setForm(f => ({ ...f, hero_cta_left: e.target.value }))} className="font-body" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Hero: Right CTA</Label>
          <Input value={form.hero_cta_right} onChange={e => setForm(f => ({ ...f, hero_cta_right: e.target.value }))} className="font-body" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Hero Introduction</Label>
        <Textarea value={form.hero_intro} onChange={e => setForm(f => ({ ...f, hero_intro: e.target.value }))} className="font-body min-h-20 resize-none" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Biography</Label>
        <Textarea value={form.biography} onChange={e => setForm(f => ({ ...f, biography: e.target.value }))} className="font-body min-h-40 resize-none" />
        <p className="text-[11px] text-muted-foreground font-body">Separate paragraphs with a blank line.</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Approach / Philosophy</Label>
        <Textarea value={form.approach} onChange={e => setForm(f => ({ ...f, approach: e.target.value }))} className="font-body min-h-32 resize-none" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Education</Label>
          <Input value={form.education} onChange={e => setForm(f => ({ ...f, education: e.target.value }))} className="font-body" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Location</Label>
          <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="font-body" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Email</Label>
          <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="font-body" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Phone (optional)</Label>
          <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="font-body" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Availability / Status</Label>
        <Input value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))} className="font-body" placeholder="e.g. Open to internships and collaborations" />
      </div>

      {/* Portrait Image */}
      <div className="space-y-2">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Portrait Image</Label>
        <div className="flex gap-3 items-start">
          <Input value={form.portrait_image} onChange={e => setForm(f => ({ ...f, portrait_image: e.target.value }))} placeholder="URL or upload" className="font-body flex-1" />
          <label className="cursor-pointer">
            <Button type="button" variant="outline" size="icon" asChild disabled={uploadingImage}>
              <span>{uploadingImage ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}</span>
            </Button>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        {form.portrait_image && (
          <img src={form.portrait_image} alt="Portrait preview" className="mt-2 rounded-lg h-32 w-24 object-cover" />
        )}
      </div>

      {/* CV / Resume Upload */}
      <div className="space-y-2">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">CV / Resume (PDF)</Label>
        <div className="flex gap-3 items-center">
          <Input
            value={form.cv_url}
            onChange={e => setForm(f => ({ ...f, cv_url: e.target.value }))}
            placeholder="URL or upload a PDF"
            className="font-body flex-1"
          />
          <label className="cursor-pointer">
            <Button type="button" variant="outline" size="icon" asChild disabled={uploadingCv}>
              <span>{uploadingCv ? <Loader2 className="size-4 animate-spin" /> : <FileUp className="size-4" />}</span>
            </Button>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadingCv(true);
                try {
                  const fd = new FormData();
                  fd.append('file', file);
                  fd.append('folder', 'portfolio/cv');
                  const { data, error } = await supabase.functions.invoke('upload-cloudinary', { body: fd });
                  if (error) throw error;
                  if (data?.error) throw new Error(data.error);
                  setForm(f => ({ ...f, cv_url: data.url }));
                  toast.success('CV uploaded successfully');
                } catch (err: any) {
                  toast.error(err.message || 'CV upload failed');
                } finally {
                  setUploadingCv(false);
                  e.target.value = '';
                }
              }}
            />
          </label>
          {form.cv_url && (
            <Button type="button" variant="ghost" size="icon" onClick={() => setForm(f => ({ ...f, cv_url: '' }))} title="Remove CV">
              <X className="size-4 text-destructive" />
            </Button>
          )}
        </div>
        {form.cv_url && (
          <a href={form.cv_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors mt-1">
            <ExternalLink className="size-3" /> Preview uploaded CV
          </a>
        )}
        <p className="text-[11px] text-muted-foreground font-body">Shown as a "Download CV" button on the About and Contact pages.</p>
      </div>

      <Button type="submit" className="font-body" disabled={mutation.isPending}>
        {mutation.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
        <Save className="size-4 mr-1" /> Save Profile
      </Button>
    </form>
  );
}
