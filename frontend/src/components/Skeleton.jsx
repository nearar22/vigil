// A dim, breathing placeholder block used while chain reads are in flight.
export default function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return <div className={`skeleton animate-shimmer ${rounded} ${className}`} aria-hidden="true" />;
}

export function OfferingSkeleton() {
  return (
    <div className="rounded-2xl border border-abyss-line/60 bg-abyss-raised/30 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
    </div>
  );
}
