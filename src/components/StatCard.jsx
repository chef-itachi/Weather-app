export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-panel/60 backdrop-blur border border-brassdim/25 rounded-2xl p-4 flex flex-col gap-1">
      <span className="font-body text-parchment/50 text-xs uppercase tracking-wide">{label}</span>
      <span className="font-mono text-parchment text-xl">{value}</span>
      <span className="font-body text-verdigris text-xs">{sub}</span>
    </div>
  );
}
