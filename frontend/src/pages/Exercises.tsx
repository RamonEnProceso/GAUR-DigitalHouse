import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExercises } from '../api/exercises';
import ExerciseCard from '../components/ExerciseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import type { Exercise } from '../types';

export default function Exercises() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getExercises({
      ...(type && { type }),
      ...(difficulty && { difficulty }),
      ...(search && { search }),
    })
      .then(setExercises)
      .catch(() => setExercises([]))
      .finally(() => setLoading(false));
  }, [type, difficulty, search]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Catálogo de ejercicios</h2>

      {/* Filtros */}
      <div className="space-y-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar ejercicio..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
        />
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="">Todos los tipos</option>
            <option value="calisthenics">Calistenia</option>
            <option value="dumbbell">Mancuernas</option>
            <option value="bar">Barra</option>
            <option value="bands">Bandas</option>
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="">Todas las dificultades</option>
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <LoadingSpinner />
      ) : exercises.length === 0 ? (
        <EmptyState icon="📋" title="Sin ejercicios" description="No se encontraron ejercicios con esos filtros" />
      ) : (
        <div className="space-y-2">
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onClick={() => navigate(`/exercises/${ex.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
