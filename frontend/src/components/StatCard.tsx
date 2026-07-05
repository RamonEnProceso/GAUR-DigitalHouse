interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: string;
  color?: 'emerald' | 'amber' | 'blue' | 'rose';
}

const colorMap = {
  emerald: 'bg-emerald-900/30 border-emerald-700/50',
  amber: 'bg-amber-900/30 border-amber-700/50',
  blue: 'bg-blue-900/30 border-blue-700/50',
  rose: 'bg-rose-900/30 border-rose-700/50',
};

export default function StatCard({ label, value, subtext, icon, color = 'emerald' }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtext && <div className="text-xs text-gray-500 mt-0.5">{subtext}</div>}
    </div>
  );
}
