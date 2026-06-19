export default function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`skeleton animate-shimmer ${rounded} bg-abyss-raised/40 ${className}`}
      aria-hidden="true"
    />
  );
}
