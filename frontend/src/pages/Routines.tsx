import { useEffect, useState } from 'react';
import { getActiveRoutine, generateRoutine as apiGenerate } from '../api/routines';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import type { Routine } from '../types';

export default function Routines() {
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [goals, setGoals] = useState('');
  const [days, setDays] = useState(3);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getActiveRoutine()
      .then((routine) => setActiveRoutine(routine))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const newRoutine = await apiGenerate({
        goals: goals || undefined,
        days_per_week: days,
      });
      setActiveRoutine(newRoutine as any);
      setShowForm(false);
      setGoals('');
    } catch (err: any) {
      alert(err.message || 'Error al generar rutina');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Agrupar ejercicios por día
  const daysMap: Record<number, Routine['exercises']> = {};
  if (activeRoutine?.exercises) {
    for (const ex of activeRoutine.exercises) {
      (daysMap[ex.day_number] ??= []).push(ex);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Rutinas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-500 transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Generar con IA'}
        </button>
      </div>

      {/* Formulario de generación */}
      {showForm && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">Generar rutina personalizada</h3>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Objetivo (opcional)</label>
            <input
              type="text"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Ej: ganar fuerza, perder peso, definir..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Días por semana</label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value={2}>2 días</option>
              <option value={3}>3 días</option>
              <option value={4}>4 días</option>
              <option value={5}>5 días</option>
              <option value={6}>6 días</option>
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-2 bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 transition-colors"
          >
            {generating ? 'Generando...' : '✨ Generar rutina'}
          </button>
        </div>
      )}

      {/* Rutina activa */}
      {!activeRoutine ? (
        <EmptyState
          icon="📅"
          title="Sin rutina activa"
          description="Genera una rutina con IA para empezar"
          action={{ label: 'Generar rutina', onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-800/30 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white">{activeRoutine.name}</h3>
            {activeRoutine.description && (
              <p className="text-sm text-gray-400 mt-1">{activeRoutine.description}</p>
            )}
            <div className="text-xs text-gray-500 mt-2">
              {activeRoutine.days_per_week} días/semana • Generada{' '}
              {new Date(activeRoutine.generated_at).toLocaleDateString('es-ES')}
            </div>
          </div>

          {Object.entries(daysMap).map(([dayNum, exercises]) => (
            <div key={dayNum}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Día {dayNum}
              </h3>
              <div className="space-y-1">
                {exercises?.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between py-2 px-3 bg-gray-800/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">#{ex.sort_order}</span>
                      <span className="text-sm text-white">{ex.exercise_name || 'Ejercicio'}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {ex.target_sets} × {ex.target_reps_min}{ex.target_reps_max ? `-${ex.target_reps_max}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
