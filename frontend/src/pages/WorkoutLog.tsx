import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createWorkout } from '../api/workouts';
import { getExercises } from '../api/exercises';
import type { Exercise } from '../types';

interface SetEntry {
  exercise_id: string;
  exercise_name: string;
  reps: number;
  weight: number;
  rpe: number;
  sort_order: number;
}

export default function WorkoutLog() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [sets, setSets] = useState<SetEntry[]>([]);
  const [search, setSearch] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getExercises().then(setExercises).catch(() => {});
  }, []);

  const addExercise = useCallback((ex: Exercise) => {
    setSets((prev) => [
      ...prev,
      {
        exercise_id: ex.id,
        exercise_name: ex.name,
        reps: 10,
        weight: 0,
        rpe: 7,
        sort_order: prev.length + 1,
      },
    ]);
    setShowPicker(false);
    setSearch('');
  }, []);

  const updateSet = useCallback((index: number, field: keyof SetEntry, value: number | string) => {
    setSets((prev) => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  }, []);

  const removeSet = useCallback((index: number) => {
    setSets((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, sort_order: i + 1 })));
  }, []);

  const handleSubmit = async () => {
    if (sets.length === 0) {
      alert('Agrega al menos un ejercicio');
      return;
    }
    setSubmitting(true);
    try {
      const result = await createWorkout({
        notes: notes || undefined,
        duration_minutes: duration || undefined,
        sets: sets.map((s) => ({
          exercise_id: s.exercise_id,
          reps: s.reps,
          weight: s.weight > 0 ? s.weight : undefined,
          rpe: s.rpe > 0 ? s.rpe : undefined,
          sort_order: s.sort_order,
        })),
      });
      navigate(`/workouts/${result.session.id}`);
    } catch (err: any) {
      alert(err.message || 'Error al guardar la sesión');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredExercises = exercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.target_muscles.some((m) => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Nuevo entrenamiento</h2>
        <button onClick={() => navigate('/workouts')} className="text-gray-400 hover:text-white text-sm">
          Cancelar
        </button>
      </div>

      {/* Fecha (siempre hoy) */}
      <div className="text-sm text-gray-400">
        {new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>

      {/* Duración */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Duración (minutos)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min={1}
          max={180}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="¿Cómo te sentiste hoy?"
          rows={2}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
        />
      </div>

      {/* Lista de series */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Ejercicios</h3>
          <button
            onClick={() => setShowPicker(true)}
            className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
          >
            + Agregar
          </button>
        </div>

        {sets.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            Agrega ejercicios a tu sesión
          </div>
        )}

        {sets.map((set, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium text-sm">{set.exercise_name}</span>
              <button onClick={() => removeSet(i)} className="text-rose-400 text-xs hover:text-rose-300">
                Quitar
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-500">Reps</label>
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(i, 'reps', Number(e.target.value))}
                  min={1}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Peso (kg)</label>
                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) => updateSet(i, 'weight', Number(e.target.value))}
                  min={0}
                  step={0.5}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">RPE</label>
                <input
                  type="number"
                  value={set.rpe}
                  onChange={(e) => updateSet(i, 'rpe', Number(e.target.value))}
                  min={1}
                  max={10}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selector de ejercicios */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={() => setShowPicker(false)}>
          <div
            className="bg-gray-900 w-full max-w-lg mx-auto rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Elegir ejercicio</h3>
              <button onClick={() => setShowPicker(false)} className="text-gray-400 text-sm">Cerrar</button>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ejercicio..."
              autoFocus
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-emerald-500"
            />
            <div className="space-y-1">
              {filteredExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => addExercise(ex)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 text-white text-sm"
                >
                  {ex.name}
                  <span className="text-gray-500 text-xs ml-2">{ex.type}</span>
                </button>
              ))}
              {filteredExercises.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-4">Sin resultados</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botón guardar */}
      <button
        onClick={handleSubmit}
        disabled={submitting || sets.length === 0}
        className="w-full py-3 bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors"
      >
        {submitting ? 'Guardando...' : `Guardar sesión (${sets.length} ejercicios)`}
      </button>
    </div>
  );
}
