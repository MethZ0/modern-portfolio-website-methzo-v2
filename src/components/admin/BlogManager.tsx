import { useState } from 'react';
import { usePosts, usePostMutations, type Post } from '@/hooks/usePosts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, Save, X, ImagePlus, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  cover_image: '',
  medium_url: '',
  tags: [] as string[],
  published_at: new Date().toISOString().split('T')[0],
  is_published: true,
  sort_order: 0,
};

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function BlogManager() {
  const { data: posts = [], isLoading } = usePosts(false); // admin sees all
  const { addPost, updatePost, deletePost } = usePostMutations();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  function resetForm() {
    setForm(emptyForm);
    setTagInput('');
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(post: Post) {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      cover_image: post.cover_image,
      medium_url: post.medium_url,
      tags: post.tags ?? [],
      published_at: post.published_at,
      is_published: post.is_published,
      sort_order: post.sort_order,
    });
    setTagInput('');
    setEditingId(post.id);
    setShowForm(true);
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput('');
  }

  function removeTag(tag: string) {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'portfolio/blog');
      const { data, error } = await supabase.functions.invoke('upload-cloudinary', { body: fd });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setForm(f => ({ ...f, cover_image: data.url }));
      toast.success('Cover image uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug || generateSlug(form.title);
    try {
      if (editingId) {
        await updatePost.mutateAsync({ id: editingId, ...form, slug });
        toast.success('Article updated');
      } else {
        await addPost.mutateAsync({ ...form, slug });
        toast.success('Article added');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this article?')) return;
    try {
      await deletePost.mutateAsync(id);
      toast.success('Article deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl italic">Blog / Articles</h2>
          <p className="text-xs font-body text-muted-foreground mt-0.5">Links to your Medium articles — no content editor needed.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}>
          <Plus className="size-4 mr-1" /> Add Article
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg italic">{editingId ? 'Edit Article' : 'New Article'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Title</Label>
                <Input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))}
                  className="font-body"
                  required
                  placeholder="My Thoughts on Clean Architecture"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Slug (auto-generated)</Label>
                  <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Published Date</Label>
                  <Input type="date" value={form.published_at} onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))} className="font-body" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Medium Article URL</Label>
                <Input
                  value={form.medium_url}
                  onChange={e => setForm(f => ({ ...f, medium_url: e.target.value }))}
                  className="font-body"
                  required
                  placeholder="https://medium.com/@yourname/article-slug"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Excerpt / Summary</Label>
                <Textarea
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  className="font-body min-h-20 resize-none"
                  placeholder="A short 1–2 sentence summary shown on the blog listing page..."
                  required
                />
              </div>

              {/* Cover image */}
              <div className="space-y-1.5">
                <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Cover Image</Label>
                <div className="flex gap-3 items-start">
                  <Input value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} placeholder="URL or upload" className="font-body flex-1" />
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline" size="icon" asChild disabled={uploadingImage}>
                      <span>{uploadingImage ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}</span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {form.cover_image && <img src={form.cover_image} alt="Preview" className="mt-2 rounded-lg h-24 object-cover" />}
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="font-body flex-1"
                    placeholder="e.g. React (press Enter)"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {form.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="font-body gap-1 pr-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive ml-0.5">×</button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={form.is_published} onCheckedChange={v => setForm(f => ({ ...f, is_published: v }))} />
                <Label className="font-body text-sm">Published (visible on site)</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="font-body" disabled={addPost.isPending || updatePost.isPending}>
                  {(addPost.isPending || updatePost.isPending) && <Loader2 className="size-4 animate-spin mr-2" />}
                  <Save className="size-4 mr-1" /> {editingId ? 'Update' : 'Add'} Article
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}><X className="size-4 mr-1" /> Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
      ) : posts.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground font-body py-8">No articles yet. Click "Add Article" to link your first Medium post.</p>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              {post.cover_image && <img src={post.cover_image} alt="" className="size-14 rounded-lg object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-body font-medium text-sm truncate">{post.title}</p>
                  {!post.is_published && <Badge variant="outline" className="font-body text-[10px] shrink-0">Draft</Badge>}
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  {format(new Date(post.published_at), 'MMM d, yyyy')}
                  {post.tags?.length > 0 && ` · ${post.tags.join(', ')}`}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {post.medium_url && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={post.medium_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" /></a>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => startEdit(post)}><Pencil className="size-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} disabled={deletePost.isPending}><Trash2 className="size-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
