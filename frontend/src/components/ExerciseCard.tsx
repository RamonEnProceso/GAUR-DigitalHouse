import type { Exercise } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-900/50 text-green-300',
  intermediate: 'bg-amber-900/50 text-amber-300',
  advanced: 'bg-red-900/50 text-red-300',
};

const typeLabels: Record<string, string> = {
  calisthenics: 'Calistenia',
  dumbbell: 'Mancuernas',
  bar: 'Barra',
  bands: 'Bandas',
};

export default function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-emerald-600/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white">{exercise.name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[exercise.difficulty]}`}>
          {exercise.difficulty}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded">
          {typeLabels[exercise.type] || exercise.type}
        </span>
        {exercise.target_muscles.slice(0, 3).map((m) => (
          <span key={m} className="text-xs text-gray-500">
            {m}
          </span>
        ))}
        {exercise.target_muscles.length > 3 && (
          <span className="text-xs text-gray-600">+{exercise.target_muscles.length - 3}</span>
        )}
      </div>
    </button>
  );
}
