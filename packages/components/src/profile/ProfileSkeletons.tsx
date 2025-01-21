import { Skeleton } from '../ui/skeleton';

export function ProfileFormSkeleton() {
  return (
    <div className="w-full lg:w-2/3 space-y-6 p-6 bg-card rounded-lg">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

export function WalletsSkeleton() {
  return (
    <div className="w-full lg:w-1/3 lg:ml-6 mt-6 lg:mt-0 p-6 bg-card rounded-lg">
      <Skeleton className="h-4 w-[150px] mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function WidgetsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-6 bg-card rounded-lg">
          <Skeleton className="h-4 w-[200px] mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DonationsTableSkeleton() {
  return (
    <div className="w-full p-6 bg-card rounded-lg">
      <Skeleton className="h-4 w-[200px] mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
