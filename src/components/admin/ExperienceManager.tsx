import { useState } from 'react';
import { useExperience, useExperienceMutations, type Experience } from '@/hooks/useExperience';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2, Save, X, Briefcase, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  type: 'work' as 'work' | 'education',
  title: '',
  organization: '',
  location: '',
  start_date: '',
  end_date: '',
  description: '',
  sort_order: 0,
};

export function ExperienceManager() {
  const { data: entries = [], isLoading } = useExperience();
  const { addExperience, updateExperience, deleteExperience } = useExperienceMutations();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(entry: Experience) {
    setForm({
      type: entry.type as 'work' | 'education',
      title: entry.title,
      organization: entry.organization,
      location: entry.location,
      start_date: entry.start_date,
      end_date: entry.end_date,
      description: entry.description,
      sort_order: entry.sort_order,
    });
    setEditingId(entry.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExperience.mutateAsync({ id: editingId, ...form });
        toast.success('Entry updated');
      } else {
        await addExperience.mutateAsync(form);
        toast.success('Entry added');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return;
    try {
      await deleteExperience.mutateAsync(id);
      toast.success('Entry deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const works = entries.filter(e => e.type === 'work');
  const education = entries.filter(e => e.type === 'education');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl italic">Experience & Education</h2>
        <Button variant="outline" size="sm" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}>
          <Plus className="size-4 mr-1" /> Add Entry
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg italic">{editingId ? 'Edit Entry' : 'New Entry'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Type</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as 'work' | 'education' }))}>
                    <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work Experience</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Sort Order</Label>
                  <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className="font-body" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">
                    {form.type === 'work' ? 'Role / Position' : 'Degree / Programme'}
                  </Label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="font-body" required placeholder={form.type === 'work' ? 'e.g. Software Engineer' : 'e.g. BSc Software Engineering'} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">
                    {form.type === 'work' ? 'Company' : 'Institution'}
                  </Label>
                  <Input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} className="font-body" required placeholder={form.type === 'work' ? 'e.g. Acme Corp' : 'e.g. SLIIT'} />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Location</Label>
                  <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="font-body" placeholder="e.g. Colombo, Sri Lanka" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Start Date</Label>
                  <Input value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} className="font-body" placeholder="e.g. Jan 2023" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">End Date</Label>
                  <Input value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} className="font-body" placeholder="e.g. Present" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Description</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="font-body min-h-24 resize-none" placeholder="Describe your responsibilities and achievements..." />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="font-body" disabled={addExperience.isPending || updateExperience.isPending}>
                  {(addExperience.isPending || updateExperience.isPending) && <Loader2 className="size-4 animate-spin mr-2" />}
                  <Save className="size-4 mr-1" /> {editingId ? 'Update' : 'Add'} Entry
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}><X className="size-4 mr-1" /> Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
      ) : entries.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground font-body py-8">No entries yet. Click "Add Entry" to start.</p>
      ) : (
        <div className="space-y-6">
          {works.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-body uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="size-3.5" /> Work Experience
              </h3>
              {works.map(entry => <EntryRow key={entry.id} entry={entry} onEdit={() => startEdit(entry)} onDelete={() => handleDelete(entry.id)} deleting={deleteExperience.isPending} />)}
            </div>
          )}
          {education.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-body uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <GraduationCap className="size-3.5" /> Education
              </h3>
              {education.map(entry => <EntryRow key={entry.id} entry={entry} onEdit={() => startEdit(entry)} onDelete={() => handleDelete(entry.id)} deleting={deleteExperience.isPending} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EntryRow({ entry, onEdit, onDelete, deleting }: { entry: Experience; onEdit: () => void; onDelete: () => void; deleting: boolean }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex-1 min-w-0">
        <p className="font-body font-medium text-sm">{entry.title}</p>
        <p className="text-xs text-muted-foreground font-body">{entry.organization}{entry.location ? ` · ${entry.location}` : ''}</p>
        <p className="text-xs text-muted-foreground font-body">{entry.start_date} — {entry.end_date || 'Present'}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="icon" onClick={onEdit}><Pencil className="size-4" /></Button>
        <Button variant="ghost" size="icon" onClick={onDelete} disabled={deleting}><Trash2 className="size-4 text-destructive" /></Button>
      </div>
    </div>
  );
}
