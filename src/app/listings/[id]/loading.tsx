// Shown while a property detail page loads its data on the server.
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="mt-8 h-9 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}
