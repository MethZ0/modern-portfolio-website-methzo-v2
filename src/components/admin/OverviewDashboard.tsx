import { useStats } from '@/hooks/useStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, Zap, Inbox, Clock, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function OverviewDashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    { 
      label: 'Projects', 
      value: stats.totalProjects, 
      icon: FolderKanban, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'Skills', 
      value: stats.totalSkills, 
      icon: Zap, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      label: 'Unread Messages', 
      value: stats.unreadMessages, 
      icon: Inbox, 
      color: stats.unreadMessages > 0 ? 'text-destructive' : 'text-green-500',
      bgColor: stats.unreadMessages > 0 ? 'bg-destructive/10' : 'bg-green-500/10'
    },
    { 
      label: 'Last Update', 
      value: stats.lastUpdated ? formatDistanceToNow(new Date(stats.lastUpdated), { addSuffix: true }) : 'Never', 
      icon: Clock, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, i) => (
          <Card key={i} className="overflow-hidden border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground font-body uppercase tracking-wider">
                {item.label}
              </CardTitle>
              <div className={`p-2 rounded-md ${item.bgColor}`}>
                <item.icon className={`size-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-body">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
