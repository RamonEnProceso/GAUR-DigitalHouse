import type { WorkoutSet } from '../types';

interface SetRowProps {
  set: WorkoutSet;
}

export default function SetRow({ set }: SetRowProps) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 bg-gray-800/30 rounded-lg text-sm">
      <span className="text-gray-500 w-6 text-center">#{set.sort_order}</span>
      <span className="flex-1 text-white font-medium">
        {set.exercise_name || 'Ejercicio'}
      </span>
      <span className="text-gray-300">
        {set.reps} reps
      </span>
      {set.weight && (
        <span className="text-gray-400">
          {set.weight}kg
        </span>
      )}
      {set.rpe && (
        <span className="text-xs text-amber-400">
          RPE {set.rpe}
        </span>
      )}
    </div>
  );
}
