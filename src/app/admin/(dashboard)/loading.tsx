// Streamed instantly while an admin page's server data loads. The sidebar
// layout stays put; only this main-content skeleton is swapped in.
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-64 rounded bg-slate-100" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="mt-8 h-64 rounded-xl border border-slate-200 bg-white" />
    </div>
  );
}
