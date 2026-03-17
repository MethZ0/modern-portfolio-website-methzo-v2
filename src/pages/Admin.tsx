import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus, Pencil, Trash2, LogOut, ImagePlus, FolderKanban, Zap, User, Link2, Code2, Award, Inbox, Briefcase, BookOpen, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import { SkillsManager } from '@/components/admin/SkillsManager';
import { ProfileEditor } from '@/components/admin/ProfileEditor';
import { SocialLinksEditor } from '@/components/admin/SocialLinksEditor';
import { TechStackEditor } from '@/components/admin/TechStackEditor';
import { AwardsEditor } from '@/components/admin/AwardsEditor';
import { InboxManager } from '@/components/admin/InboxManager';
import { ExperienceManager } from '@/components/admin/ExperienceManager';
import { BlogManager } from '@/components/admin/BlogManager';
import { OverviewDashboard } from '@/components/admin/OverviewDashboard';
import { SortableProjectList } from '@/components/admin/SortableProjectList';
import { ChangePasswordForm } from '@/components/admin/ChangePasswordForm';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type Project = Tables<'projects'>;

type Tab = 'overview' | 'projects' | 'skills' | 'profile' | 'social' | 'techstack' | 'awards' | 'inbox' | 'experience' | 'blog' | 'security';

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'social', label: 'Social Links', icon: Link2 },
  { id: 'techstack', label: 'Tech Stack', icon: Code2 },
  { id: 'awards', label: 'Awards', icon: Award },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export default function Admin() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useSessionTimeout(signOut, 30 * 60 * 1000, isAdmin);

  // Unread inbox count for badge
  const { data: unreadSubmissions = [] } = useQuery<{ is_read: boolean }[]>({
    queryKey: ['contact_submissions_unread_count'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_submissions').select('is_read');
      return (data ?? []) as { is_read: boolean }[];
    },
    enabled: !!isAdmin,
  });
  const unreadCount = unreadSubmissions.filter(s => !s.is_read).length;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'web-app',
    description: '',
    cover_image: '',
    tech_stack: '',
    year: new Date().getFullYear().toString(),
    client: '',
    location: '',
    github_url: '',
    live_url: '',
    is_featured: false,
    sort_order: 0,
    images: '[]',
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate('/admin/login');
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchProjects();
  }, [isAdmin]);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
    setProjects(data || []);
    setLoading(false);
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function resetForm() {
    setForm({ title: '', slug: '', category: 'web-app', description: '', cover_image: '', tech_stack: '', year: new Date().getFullYear().toString(), client: '', location: '', github_url: '', live_url: '', is_featured: false, sort_order: 0, images: '[]' });
    setEditingId(null);
    setShowForm(false);
  }

  function editProject(project: Project) {
    setForm({
      title: project.title, slug: project.slug, category: project.category,
      description: project.description, cover_image: project.cover_image,
      tech_stack: project.tech_stack || '', year: project.year,
      client: project.client || '', location: project.location || '',
      github_url: project.github_url || '', live_url: project.live_url || '',
      is_featured: project.is_featured, sort_order: project.sort_order,
      images: JSON.stringify(project.images),
    });
    setEditingId(project.id);
    setShowForm(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'portfolio');
      const { data, error } = await supabase.functions.invoke('upload-cloudinary', { body: formData });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setForm(prev => ({ ...prev, cover_image: data.url }));
      toast.success('Image uploaded to Cloudinary');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      let currentImages: { id: string; src: string; alt: string; aspectRatio: string }[] = [];
      try { currentImages = JSON.parse(form.images); } catch { currentImages = []; }
      for (const file of Array.from(files)) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('folder', 'portfolio/gallery');
        const { data, error } = await supabase.functions.invoke('upload-cloudinary', { body: uploadData });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        currentImages.push({ id: crypto.randomUUID(), src: data.url, alt: file.name.replace(/\.[^/.]+$/, ''), aspectRatio: 'landscape' });
      }
      setForm(prev => ({ ...prev, images: JSON.stringify(currentImages) }));
      toast.success(`${files.length} image(s) uploaded`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  }

  function removeGalleryImage(id: string) {
    try {
      const images = JSON.parse(form.images).filter((img: any) => img.id !== id);
      setForm(prev => ({ ...prev, images: JSON.stringify(images) }));
    } catch { /* ignore */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || generateSlug(form.title);
    let images: unknown[];
    try { images = JSON.parse(form.images); } catch { images = []; }
    const payload = {
      title: form.title.trim(), slug, category: form.category, description: form.description.trim(),
      cover_image: form.cover_image.trim(), tech_stack: form.tech_stack.trim() || null,
      year: form.year, client: form.client.trim() || null, location: form.location.trim() || null,
      github_url: form.github_url.trim() || null, live_url: form.live_url.trim() || null,
      is_featured: form.is_featured, sort_order: form.sort_order, images: images as any,
    };
    let error;
    if (editingId) {
      ({ error } = await supabase.from('projects').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('projects').insert(payload));
    }
    if (error) toast.error(error.message);
    else { toast.success(editingId ? 'Project updated' : 'Project added'); resetForm(); fetchProjects(); }
    setSaving(false);
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Project deleted'); fetchProjects(); }
  }

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="min-h-screen py-28 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl italic">Admin Dashboard</h1>
            <p className="text-sm font-body text-muted-foreground mt-1">Manage your portfolio content</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/'); }}>
            <LogOut className="size-4" />
          </Button>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-1 mb-8 p-1 rounded-xl bg-muted/50 border border-border">
        {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
              className={cn(
                'relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
              {tab.id === 'inbox' && unreadCount > 0 && (
                <span className="ml-0.5 flex items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold min-w-[16px] h-4 px-1">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="font-display text-xl italic">Portfolio Overview</h2>
            <p className="text-sm font-body text-muted-foreground">High-level statistics and dashboard for your portfolio.</p>
            <Separator />
            <OverviewDashboard />
          </div>
        )}

        {/* ── Projects Tab ── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl italic">Projects</h2>
              <Button variant="outline" size="sm" onClick={() => { setShowForm(true); setEditingId(null); }}>
                <Plus className="size-4 mr-1" /> Add Project
              </Button>
            </div>

            {showForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl italic">{editingId ? 'Edit Project' : 'New Project'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Title</Label>
                        <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))} className="font-body" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Slug</Label>
                        <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} className="font-body" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Category</Label>
                        <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                          <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web-app">Web App</SelectItem>
                            <SelectItem value="mobile-app">Mobile App</SelectItem>
                            <SelectItem value="fullstack">Full Stack</SelectItem>
                            <SelectItem value="api">API</SelectItem>
                            <SelectItem value="ui-ux">UI/UX</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="open-source">Open Source</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Year</Label>
                        <Input value={form.year} onChange={(e) => setForm(f => ({ ...f, year: e.target.value }))} className="font-body" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Description</Label>
                      <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className="font-body min-h-24 resize-none" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Cover Image</Label>
                      <div className="flex gap-3 items-start">
                        <Input value={form.cover_image} onChange={(e) => setForm(f => ({ ...f, cover_image: e.target.value }))} placeholder="URL or upload" className="font-body flex-1" required />
                        <label className="cursor-pointer">
                          <Button type="button" variant="outline" size="icon" asChild disabled={uploadingImage}>
                            <span>{uploadingImage ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}</span>
                          </Button>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                      {form.cover_image && <img src={form.cover_image} alt="Preview" className="mt-2 rounded-lg h-32 object-cover" />}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Tech Stack</Label>
                        <Input value={form.tech_stack} onChange={(e) => setForm(f => ({ ...f, tech_stack: e.target.value }))} placeholder="React, Node.js, …" className="font-body" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Client / Context</Label>
                        <Input value={form.client} onChange={(e) => setForm(f => ({ ...f, client: e.target.value }))} className="font-body" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Location</Label>
                        <Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} className="font-body" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">GitHub URL</Label>
                        <Input value={form.github_url} onChange={(e) => setForm(f => ({ ...f, github_url: e.target.value }))} className="font-body" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Live URL</Label>
                      <Input value={form.live_url} onChange={(e) => setForm(f => ({ ...f, live_url: e.target.value }))} className="font-body" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Gallery Images</Label>
                      <div className="flex flex-wrap gap-3">
                        {(() => {
                          try {
                            const imgs = JSON.parse(form.images);
                            return Array.isArray(imgs) ? imgs.map((img: any) => (
                              <div key={img.id} className="relative group">
                                <img src={img.src} alt={img.alt} className="h-20 w-28 rounded-lg object-cover border border-border" />
                                <button type="button" onClick={() => removeGalleryImage(img.id)} className="absolute -top-2 -right-2 size-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                              </div>
                            )) : null;
                          } catch { return null; }
                        })()}
                        <label className="h-20 w-28 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          {uploadingGallery ? <Loader2 className="size-5 animate-spin text-muted-foreground" /> : <><ImagePlus className="size-5 text-muted-foreground" /><span className="text-[10px] text-muted-foreground mt-1">Add</span></>}
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={form.is_featured} onCheckedChange={(v) => setForm(f => ({ ...f, is_featured: v }))} />
                      <Label className="font-body text-sm">Featured project</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="font-body" disabled={saving}>
                        {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                        {editingId ? 'Update' : 'Add'} Project
                      </Button>
                      <Button type="button" variant="ghost" onClick={resetForm} className="font-body">Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <SortableProjectList
              projects={projects}
              onEdit={editProject}
              onDelete={deleteProject}
              onReordered={fetchProjects}
            />
          </div>
        )}

        {/* ── Skills Tab ── */}
        {activeTab === 'skills' && <SkillsManager />}

        {/* ── Profile Tab ── */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="font-display text-xl italic">Profile & Identity</h2>
            <Separator />
            <ProfileEditor />
          </div>
        )}

        {/* ── Social Links Tab ── */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="font-display text-xl italic">Social Links</h2>
            <Separator />
            <SocialLinksEditor />
          </div>
        )}

        {/* ── Tech Stack Tab ── */}
        {activeTab === 'techstack' && (
          <div className="space-y-6">
            <h2 className="font-display text-xl italic">Tech Stack</h2>
            <p className="text-sm font-body text-muted-foreground">Displayed as badges on the About page.</p>
            <Separator />
            <TechStackEditor />
          </div>
        )}

        {/* ── Awards Tab ── */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            <h2 className="font-display text-xl italic">Awards & Recognition</h2>
            <p className="text-sm font-body text-muted-foreground">Displayed in the Recognition section on the About page.</p>
            <Separator />
            <AwardsEditor />
          </div>
        )}

        {/* ── Experience Tab ── */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <Separator />
            <ExperienceManager />
          </div>
        )}

        {/* ── Blog Tab ── */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <Separator />
            <BlogManager />
          </div>
        )}

        {/* ── Inbox Tab ── */}
        {activeTab === 'inbox' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl italic">Inbox</h2>
              {unreadCount > 0 && (
                <span className="flex items-center justify-center rounded-full bg-foreground text-background text-xs font-bold min-w-[22px] h-5 px-1.5">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm font-body text-muted-foreground">Messages sent via the Contact page form.</p>
            <Separator />
            <InboxManager />
          </div>
        )}

        {/* ── Security Tab ── */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="font-display text-xl italic">Security Settings</h2>
            <Separator />
            <ChangePasswordForm />
          </div>
        )}
      </div>
    </div>
  );
}
