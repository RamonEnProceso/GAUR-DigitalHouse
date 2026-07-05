import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWorkouts } from '../api/workouts';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import type { WorkoutSession } from '../types';

export default function WorkoutList() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkouts()
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Historial de entrenos</h2>
        <Link
          to="/workouts/new"
          className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-500 transition-colors"
        >
          + Nuevo
        </Link>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon="💪"
          title="Sin entrenos registrados"
          description="Comienza registrando tu primera sesión"
          action={{ label: 'Registrar entreno', onClick: () => window.location.href = '/workouts/new' }}
        />
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <Link
              key={session.id}
              to={`/workouts/${session.id}`}
              className="block bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-emerald-600/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">
                    {new Date(session.performed_at).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </div>
                  {session.notes && (
                    <div className="text-sm text-gray-400 mt-0.5 line-clamp-1">
                      {session.notes}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {session.duration_minutes && (
                    <div className="text-sm text-gray-400">{session.duration_minutes} min</div>
                  )}
                  <div className="text-xs text-gray-600 mt-0.5">
                    {new Date(session.created_at).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
