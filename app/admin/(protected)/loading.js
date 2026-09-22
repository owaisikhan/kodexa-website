export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-[var(--color-surface-2)]" />
      <div className="h-10 w-full max-w-lg animate-pulse bg-[var(--color-surface-2)]" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-[var(--color-surface-2)]" />
      ))}
    </div>
  );
}
