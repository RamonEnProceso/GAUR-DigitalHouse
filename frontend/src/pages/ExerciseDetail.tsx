import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExerciseById } from '../api/exercises';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Exercise } from '../types';

const typeLabels: Record<string, string> = {
  calisthenics: 'Calistenia',
  dumbbell: 'Mancuernas',
  bar: 'Barra',
  bands: 'Bandas',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-900/50 text-green-300',
  intermediate: 'bg-amber-900/50 text-amber-300',
  advanced: 'bg-red-900/50 text-red-300',
};

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getExerciseById(id)
      .then(setExercise)
      .catch(() => navigate('/exercises'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!exercise) return <div className="text-gray-400 text-center p-8">Ejercicio no encontrado</div>;

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/exercises')} className="text-gray-400 hover:text-white text-sm">
        ← Volver
      </button>

      <div>
        <h2 className="text-xl font-bold text-white">{exercise.name}</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded">
            {typeLabels[exercise.type] || exercise.type}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>

      {exercise.description && (
        <div className="bg-gray-800/30 rounded-xl p-4">
          <p className="text-sm text-gray-300">{exercise.description}</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Músculos trabajados</h3>
        <div className="flex flex-wrap gap-2">
          {exercise.target_muscles.map((m) => (
            <span key={m} className="bg-emerald-900/30 text-emerald-300 text-xs px-2 py-1 rounded-full border border-emerald-700/50">
              {m}
            </span>
          ))}
        </div>
      </div>

      {exercise.instructions && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Instrucciones</h3>
          <div className="bg-gray-800/30 rounded-xl p-4">
            <p className="text-sm text-gray-300 whitespace-pre-line">{exercise.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}
