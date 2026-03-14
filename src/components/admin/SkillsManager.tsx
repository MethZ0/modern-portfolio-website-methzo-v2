import { useState } from 'react';
import { useSkills, useSkillsMutations, type Skill } from '@/hooks/useSkills';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'UI/UX', 'Mobile'];

export function SkillsManager() {
  const { data: skills = [], isLoading } = useSkills();
  const { addSkill, updateSkill, deleteSkill } = useSkillsMutations();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', category: 'Frontend', percentage: 50, sort_order: 0 });

  function resetForm() {
    setForm({ name: '', category: 'Frontend', percentage: 50, sort_order: 0 });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(skill: Skill) {
    setForm({ name: skill.name, category: skill.category, percentage: skill.percentage, sort_order: skill.sort_order });
    setEditingId(skill.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateSkill.mutateAsync({ id: editingId, ...form });
        toast.success('Skill updated');
      } else {
        await addSkill.mutateAsync(form);
        toast.success('Skill added');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this skill?')) return;
    try {
      await deleteSkill.mutateAsync(id);
      toast.success('Skill deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl italic">Skills</h2>
        <Button variant="outline" size="sm" onClick={() => { setShowForm(true); setEditingId(null); }}>
          <Plus className="size-4 mr-1" /> Add Skill
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg italic">
              {editingId ? 'Edit Skill' : 'New Skill'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Name</Label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Category</Label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">
                  Proficiency — {form.percentage}%
                </Label>
                <Slider
                  value={[form.percentage]}
                  onValueChange={([v]) => setForm(f => ({ ...f, percentage: v }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className="font-body w-24"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="font-body" disabled={addSkill.isPending || updateSkill.isPending}>
                  {(addSkill.isPending || updateSkill.isPending) && <Loader2 className="size-4 animate-spin mr-2" />}
                  <Save className="size-4 mr-1" />
                  {editingId ? 'Update' : 'Add'}
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}><X className="size-4 mr-1" /> Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
      ) : skills.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground font-body py-8">No skills yet. Add your first skill above.</p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-body font-medium text-muted-foreground uppercase tracking-wide">{category}</h3>
            {items.map(skill => (
              <div key={skill.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-body font-medium truncate">{skill.name}</span>
                    <span className="text-xs font-body text-muted-foreground">{skill.percentage}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${skill.percentage}%` }} />
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => startEdit(skill)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDelete(skill.id)}>
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
