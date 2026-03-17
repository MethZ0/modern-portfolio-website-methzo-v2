import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';

type Project = Tables<'projects'>;

/* ─────────────────────────────────────────────────────────────────
   Single draggable row
───────────────────────────────────────────────────────────────── */
function SortableRow({
  project,
  onEdit,
  onDelete,
  isDeleting,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 rounded-xl border border-border bg-card p-4 select-none',
        isDragging && 'opacity-40 shadow-lg ring-2 ring-primary/30'
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors shrink-0 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>

      {/* Cover */}
      {project.cover_image && (
        <img
          src={project.cover_image}
          alt=""
          className="size-12 rounded-lg object-cover shrink-0 pointer-events-none"
        />
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-body font-medium text-sm truncate">{project.title}</h3>
        <p className="text-xs text-muted-foreground font-body">
          {project.category} · {project.year}
          {project.is_featured && (
            <Badge variant="outline" className="ml-2 px-1.5 py-0 text-[10px] font-body">
              Featured
            </Badge>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={isDeleting}
          onClick={() => onDelete(project.id)}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4 text-destructive" />
          )}
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Ghost card shown under pointer while dragging
───────────────────────────────────────────────────────────────── */
function DragGhost({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-card shadow-2xl p-4 w-full opacity-95 ring-2 ring-primary/20">
      <GripVertical className="size-4 text-muted-foreground shrink-0" />
      {project.cover_image && (
        <img src={project.cover_image} alt="" className="size-12 rounded-lg object-cover shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-body font-medium text-sm truncate">{project.title}</h3>
        <p className="text-xs text-muted-foreground font-body">{project.category} · {project.year}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main sortable list
───────────────────────────────────────────────────────────────── */
export function SortableProjectList({
  projects: initialProjects,
  onEdit,
  onDelete,
  onReordered,
}: {
  projects: Project[];
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onReordered: () => void;
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Keep local list in sync when parent refetches
  const syncedProjects = initialProjects.map((p) => {
    const local = projects.find((l) => l.id === p.id);
    return local || p;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) return;

      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      const reordered = arrayMove(projects, oldIndex, newIndex);

      // Optimistically update UI immediately
      setProjects(reordered);
      setSaving(true);

      try {
        // Persist — update each project's sort_order to its new array position
        const updates = reordered.map((p, i) =>
          supabase.from('projects').update({ sort_order: i }).eq('id', p.id)
        );
        const results = await Promise.all(updates);
        const failed = results.find((r) => r.error);
        if (failed?.error) throw failed.error;
        toast.success('Project order saved');
        onReordered();
      } catch (err: any) {
        toast.error(err.message || 'Failed to save order');
        // Roll back
        setProjects(projects);
      } finally {
        setSaving(false);
      }
    },
    [projects, onReordered]
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Project deleted');
      onReordered();
    }
    setDeletingId(null);
  };

  const activeProject = activeId ? (projects.find((p) => p.id === activeId) ?? null) : null;

  if (projects.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground font-body py-12">
        No projects yet. Click "Add Project" to get started.
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {saving && (
        <p className="text-xs text-muted-foreground font-body flex items-center gap-1.5">
          <Loader2 className="size-3 animate-spin" /> Saving order…
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {projects.map((project) => (
              <SortableRow
                key={project.id}
                project={project}
                onEdit={onEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === project.id}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeProject && <DragGhost project={activeProject} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
