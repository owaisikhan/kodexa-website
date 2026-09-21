export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-white/[0.04]" />
      <div className="h-10 w-full max-w-lg animate-pulse rounded-full bg-white/[0.03]" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/[0.03]" />
      ))}
    </div>
  );
}
