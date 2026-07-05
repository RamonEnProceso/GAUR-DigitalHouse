import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkoutById, deleteWorkout } from '../api/workouts';
import SetRow from '../components/SetRow';
import LoadingSpinner from '../components/LoadingSpinner';
import type { WorkoutSession } from '../types';

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getWorkoutById(id)
      .then(setSession)
      .catch(() => navigate('/workouts'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta sesión? Esta acción no se puede deshacer.')) return;
    if (!id) return;
    setDeleting(true);
    try {
      await deleteWorkout(id);
      navigate('/workouts');
    } catch {
      alert('Error al eliminar la sesión');
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!session) return <div className="text-gray-400 text-center p-8">Sesión no encontrada</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/workouts')} className="text-gray-400 hover:text-white text-sm">
          ← Volver
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-rose-400 hover:text-rose-300 text-sm disabled:opacity-50"
        >
          {deleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">
          {new Date(session.performed_at).toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        {session.duration_minutes && (
          <p className="text-sm text-gray-400">Duración: {session.duration_minutes} min</p>
        )}
      </div>

      {session.notes && (
        <div className="bg-gray-800/30 rounded-xl p-3">
          <p className="text-sm text-gray-300">{session.notes}</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Series ({session.sets?.length || 0})
        </h3>
        <div className="space-y-1">
          {session.sets?.map((set) => (
            <SetRow key={set.id} set={set} />
          ))}
        </div>
      </div>
    </div>
  );
}
