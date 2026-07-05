interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-800/50 rounded-full text-sm text-gray-400">
        <span>🔥</span>
        <span>Sin racha</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-900/30 border border-orange-700/50 rounded-full text-sm text-orange-300">
      <span>🔥</span>
      <span className="font-bold">{streak}</span>
      <span>{streak === 1 ? 'día' : 'días'} consecutivos</span>
    </div>
  );
}
