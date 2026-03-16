import { useState, useEffect } from 'react';
import { useProfile, useProfileMutation } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Plus, Trash2, Award } from 'lucide-react';
import { toast } from 'sonner';

export function AwardsEditor() {
  const { data: profile, isLoading } = useProfile();
  const mutation = useProfileMutation();
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (profile) setItems(profile.awards ?? []);
  }, [profile]);

  function addItem() {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    setItems(prev => [...prev, trimmed]);
    setNewItem('');
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!profile?.id) { toast.error('Profile not loaded yet'); return; }
    try {
      await mutation.mutateAsync({ id: profile.id, awards: items });
      toast.success('Awards saved');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      {/* Add new */}
      <div className="space-y-1.5">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Add Award / Recognition</Label>
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
            placeholder="e.g. Dean's List - SLIIT Faculty of Computing"
            className="font-body flex-1"
          />
          <Button type="button" variant="outline" onClick={addItem} disabled={!newItem.trim()}>
            <Plus className="size-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Current list */}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 group">
            <Award className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-sm font-body flex-1">{item}</span>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
              aria-label="Remove"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground font-body">No awards yet. Add one above.</p>
        )}
      </div>

      <Button onClick={handleSave} className="font-body" disabled={mutation.isPending}>
        {mutation.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
        <Save className="size-4 mr-1" /> Save Awards
      </Button>
    </div>
  );
}
