import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Mail, MailOpen, ExternalLink, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

type Submission = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

function useSubmissions() {
  return useQuery<Submission[]>({
    queryKey: ['contact_submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Submission[];
    },
  });
}

export function InboxManager() {
  const queryClient = useQueryClient();
  const { data: submissions = [], isLoading } = useSubmissions();
  const [expanded, setExpanded] = useState<string | null>(null);

  const unreadCount = submissions.filter(s => !s.is_read).length;

  const toggleRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_submissions'] });
      queryClient.invalidateQueries({ queryKey: ['contact_submissions_unread_count'] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteSubmission = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Message deleted');
      queryClient.invalidateQueries({ queryKey: ['contact_submissions'] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  async function handleExpand(submission: Submission) {
    const isNowOpen = expanded === submission.id;
    setExpanded(isNowOpen ? null : submission.id);
    // Mark as read automatically when opened
    if (!submission.is_read && !isNowOpen) {
      toggleRead.mutate({ id: submission.id, is_read: true });
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
        <Inbox className="size-10 opacity-30" />
        <p className="text-sm font-body">No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-body text-muted-foreground">
          {submissions.length} message{submissions.length !== 1 ? 's' : ''}
          {unreadCount > 0 && ` · `}
          {unreadCount > 0 && <span className="text-foreground font-medium">{unreadCount} unread</span>}
        </p>
      </div>

      {submissions.map((submission) => {
        const isOpen = expanded === submission.id;
        return (
          <div
            key={submission.id}
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              submission.is_read
                ? 'border-border bg-card'
                : 'border-foreground/20 bg-card shadow-sm shadow-foreground/[0.04]'
            }`}
          >
            {/* Header row */}
            <button
              type="button"
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
              onClick={() => handleExpand(submission)}
            >
              {/* Read indicator */}
              <div className="shrink-0">
                {submission.is_read
                  ? <MailOpen className="size-4 text-muted-foreground" />
                  : <Mail className="size-4 text-foreground" />
                }
              </div>

              {/* Name + preview */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-body truncate ${submission.is_read ? 'text-muted-foreground' : 'font-semibold text-foreground'}`}>
                    {submission.name}
                  </span>
                  {!submission.is_read && (
                    <span className="size-1.5 rounded-full bg-foreground shrink-0" />
                  )}
                  <Badge variant="outline" className="font-body text-[10px] px-2 py-0 shrink-0 ml-auto">
                    {submission.project_type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-body truncate">
                  {submission.email} · {submission.message.slice(0, 60)}{submission.message.length > 60 ? '…' : ''}
                </p>
              </div>

              {/* Time */}
              <span className="text-[11px] text-muted-foreground font-body shrink-0 hidden sm:block">
                {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
              </span>
            </button>

            {/* Expanded message body */}
            {isOpen && (
              <div className="px-4 pb-4 border-t border-border/60 pt-4 space-y-4">
                <div className="grid sm:grid-cols-3 gap-3 text-xs font-body text-muted-foreground">
                  <div>
                    <span className="uppercase tracking-wide text-[10px]">From</span>
                    <p className="text-foreground mt-0.5">{submission.name}</p>
                  </div>
                  <div>
                    <span className="uppercase tracking-wide text-[10px]">Email</span>
                    <p className="text-foreground mt-0.5">{submission.email}</p>
                  </div>
                  <div>
                    <span className="uppercase tracking-wide text-[10px]">Project Type</span>
                    <p className="text-foreground mt-0.5">{submission.project_type}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4 text-sm font-body leading-relaxed text-foreground whitespace-pre-wrap">
                  {submission.message}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-body gap-1.5"
                    asChild
                  >
                    <a href={`mailto:${submission.email}?subject=Re: ${submission.project_type}`}>
                      <ExternalLink className="size-3.5" /> Reply via Email
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-body gap-1.5"
                    onClick={() => toggleRead.mutate({ id: submission.id, is_read: !submission.is_read })}
                    disabled={toggleRead.isPending}
                  >
                    {submission.is_read
                      ? <><Mail className="size-3.5" /> Mark Unread</>
                      : <><MailOpen className="size-3.5" /> Mark Read</>
                    }
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-body gap-1.5 text-destructive hover:text-destructive ml-auto"
                    onClick={() => { if (confirm('Delete this message?')) deleteSubmission.mutate(submission.id); }}
                    disabled={deleteSubmission.isPending}
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
