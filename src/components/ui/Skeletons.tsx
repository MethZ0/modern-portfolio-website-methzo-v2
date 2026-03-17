import { Skeleton } from '@/components/ui/skeleton';

export function ProjectSkeleton() {
  return (
    <div className="group block w-full text-left rounded-xl">
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-muted/50 border border-border/30">
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>

      <div className="mt-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2 w-1/3" />
      </div>
    </div>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="min-h-screen py-28 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12 md:space-y-20">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <div className="grid gap-10 md:gap-14">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group grid md:grid-cols-[1fr_1.5fr] gap-6 md:gap-10 items-start">
              <div className="aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl bg-muted/50 border border-border/30">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="flex flex-col justify-center space-y-4 pt-2 md:pt-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-5/6" />
                  <Skeleton className="h-8 w-4/6" />
                </div>
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-4 w-32 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
