import { useState, useEffect } from 'react';
import { useProfile, useProfileMutation } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export function TechStackEditor() {
  const { data: profile, isLoading } = useProfile();
  const mutation = useProfileMutation();
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (profile) setItems(profile.tech_stack ?? []);
  }, [profile]);

  function addItem() {
    const trimmed = newItem.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setItems(prev => [...prev, trimmed]);
    setNewItem('');
  }

  function removeItem(item: string) {
    setItems(prev => prev.filter(i => i !== item));
  }

  async function handleSave() {
    if (!profile?.id) { toast.error('Profile not loaded yet'); return; }
    try {
      await mutation.mutateAsync({ id: profile.id, tech_stack: items });
      toast.success('Tech stack saved');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      {/* Add new */}
      <div className="space-y-1.5">
        <Label className="text-xs font-body uppercase tracking-wide text-muted-foreground">Add Technology</Label>
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
            placeholder="e.g. React, Docker, Kotlin…"
            className="font-body flex-1"
          />
          <Button type="button" variant="outline" onClick={addItem} disabled={!newItem.trim()}>
            <Plus className="size-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Current list */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map(item => (
            <Badge key={item} variant="secondary" className="font-body text-sm px-3 py-1.5 rounded-full gap-1.5 group cursor-default">
              {item}
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="opacity-50 hover:opacity-100 transition-opacity"
                aria-label={`Remove ${item}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground font-body">No technologies yet. Add one above.</p>
      )}

      <Button onClick={handleSave} className="font-body" disabled={mutation.isPending}>
        {mutation.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
        <Save className="size-4 mr-1" /> Save Tech Stack
      </Button>
    </div>
  );
}
